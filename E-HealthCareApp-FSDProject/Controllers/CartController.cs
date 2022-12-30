using E_HealthCareApp_FSDProject.Controllers.Services.UserService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace E_HealthCareApp_FSDProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CartController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserService _userService;

        public CartController(DataContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public class CartObject
        {
            public string name { get; set; } = string.Empty;
            public int quantity { get; set; } = 0;
            public double price { get; set; } = 0;
        }

        [HttpGet("getAllCarts")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<CartObject>>> GetAllCarts()
        {
            var cart = await _context.Carts.ToArrayAsync();
            var content = new List<CartObject>();
            var found = 0;
            foreach (var item in cart)
            {
                found = 0;
                var productName = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                if (productName == null)
                {
                    return BadRequest(JsonConvert.SerializeObject(new { message = "Error" }));
                }
                for (int i = 0; i < content.Count; i++)
                {
                    if (content[i].name.Equals(productName.Name))
                    {
                        content[i].quantity += item.Quantity;
                        content[i].price += item.TotalPrice;
                        found = 1;
                    }
                }
                if (found == 0)
                {
                    var obj = new CartObject();
                    obj.name = productName.Name;
                    obj.quantity = item.Quantity;
                    obj.price = item.TotalPrice;
                    content.Add(obj);
                }
            }
            if (content.Count == 0)
                return BadRequest(JsonConvert.SerializeObject(new { message = "Error" }));
            else
                return Ok(content.ToArray());
        }

        [HttpGet("getCartByUserId")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<CartObject>>> GetCartByUserId()
        {
            var userId = int.Parse(_userService.GetMyId());
            var cart = await _context.Carts.Where(c => c.UserId == userId).ToArrayAsync();
            var content = new List<CartObject>();
            foreach (var item in cart)
            {
                var productName = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                var obj = new CartObject();
                obj.name = productName.Name;
                obj.quantity = item.Quantity;
                obj.price = item.TotalPrice;
                content.Add(obj);
            }
            return Ok(content.Count == 0 ? JsonConvert.SerializeObject(new { message = "Error" }) : content.ToArray());
        }

        [HttpPut("addToCart/{productId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Cart>> AddToCart(int productId)
        {
            var userId = int.Parse(_userService.GetMyId());
            var checkProd = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);

            if (checkProd == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Product or user not found." }));
            }

            if (checkProd.Quantity <= 0)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Not enough stock." }));
            }

            var cart = await _context.Carts.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.ProductId == productId);

            if (cart == null)
            {
                var newCart = new Cart
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = 1,
                    TotalPrice = checkProd.Price
                };

                checkProd.Quantity--;

                _context.Carts.Add(newCart);
                await _context.SaveChangesAsync();

                return Ok(newCart);
            }

            cart.Quantity++;
            cart.TotalPrice += checkProd.Price;
            checkProd.Quantity--;

            await _context.SaveChangesAsync();

            return Ok(cart);
        }

        [HttpPut("removeFromCart/{productId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Cart>> RemoveFromCart(int productId)
        {
            var userId = int.Parse(_userService.GetMyId());
            var checkProd = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);

            if (checkProd == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Product or user not found." }));
            }

            var cart = await _context.Carts.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.ProductId == productId);

            if (cart == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Nothing to remove." }));
            }

            cart.Quantity--;
            cart.TotalPrice -= checkProd.Price;

            checkProd.Quantity++;

            if (cart.Quantity <= 0)
            {
                _context.Carts.Remove(cart);
            }

            await _context.SaveChangesAsync();

            return Ok(cart);
        }
    }
}
