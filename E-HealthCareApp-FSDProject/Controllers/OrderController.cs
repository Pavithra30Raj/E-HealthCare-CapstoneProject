using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using E_HealthCareApp_FSDProject.Controllers.Services.UserService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.Models;

namespace E_HealthCareApp_FSDProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserService _userService;

        public OrderController(DataContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("getAllOrders")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Order>> GetAllOrders()
        {
            List<Order>? order = await _context.Orders.ToListAsync();

            if (order == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Order not found." }));
            }

            if (order.Count() <= 0)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Nothing inside." }));
            }

            return Ok(order);
        }

        [HttpGet("getOrderByUserId")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Order>> GetOrderByUserId()
        {
            int userId = int.Parse(_userService.GetMyId());
            List<Order>? order = await _context.Orders.Where(o => o.UserId == userId).ToListAsync();

            if (order == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Order not found." }));
            }

            if (order.Count() <= 0)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Nothing inside." }));
            }

            return Ok(order);
        }

        [HttpPut("buyCartContent")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Order>> BuyCartContent()
        {
            int userId = int.Parse(_userService.GetMyId());
            List<Cart>? carts = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
            if (carts.Count() <= 0)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Nothing inside." }));
            }

            Account? account = await _context.Accounts.FindAsync(userId);
            if (account == null)
                return BadRequest(JsonConvert.SerializeObject(new { message = "No user" }));

            double price = 0;
            foreach (Cart? cart in carts)
            {
                price += cart.TotalPrice;
            }
            if (account != null)
            {
                if (account.Funds < price)
                {
                    return BadRequest(JsonConvert.SerializeObject(new { message = "Not enough funds" }));
                }
            }

            string productNames = "";
            Order? order = new Order();
            foreach (Cart? cartItem in carts)
            {
                
                Product? product = await _context.Products.FindAsync(cartItem.ProductId);
                if (product != null)
                {
                    productNames += product.Name + " ";
                }

                order.TotalPrice += cartItem.TotalPrice;
                _context.Carts.Remove(cartItem);
            }

            order.ProductNames = productNames;
            order.UserId = userId;
            order.Status = "Pending delivery";
            order.DateTime = DateTime.UtcNow;

            
            account.Funds -= order.TotalPrice;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
