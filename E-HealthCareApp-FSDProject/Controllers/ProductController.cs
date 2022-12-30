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
    public class ProductController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserService _userService;
        public ProductController(DataContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("getAllProducts")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            var prods = await _context.Products.ToListAsync();
            if (prods.Count == 0)
                return BadRequest(JsonConvert.SerializeObject(new { message = "No products." }));
            return Ok(prods);
        }

        [HttpGet("getProductById/{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Product not found." }));
            }

            return Ok(product);
        }

        [HttpGet("getProductByUse/{use}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<Product>>> GetProductsByUse(string use)
        {
            var product = await _context.Products.Where(p => p.Uses.Contains(use)).ToListAsync();
            if (product == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Product not found." }));
            }

            return Ok(product);
        }

        [HttpPut("updateMedicine/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }
            var prod = await _context.Products.FindAsync(id);
            prod.Quantity = product.Quantity;
            prod.Price = product.Price; 
            prod.Description = product.Description;
            prod.Uses = product.Uses;
            prod.ExpireDate = product.ExpireDate;
            prod.CompanyName = product.CompanyName;
            prod.Name = product.Name;

            await _context.SaveChangesAsync();

            return Ok(prod);
        }

        [HttpPost("addProduct")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<Product>>> AddProduct(Product product)
        {
            if (product.GetType().GetProperties()
                .Where(p => p.PropertyType == typeof(string))
                .Select(p => (string)p.GetValue(product))
                .Any(value => value.Equals("string")))
            {
                return BadRequest();
            }

            var prod = await _context.Products.FirstOrDefaultAsync(x => x.Name == product.Name);
            if (prod != null)
                return BadRequest();

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(await _context.Products.ToListAsync());
        }

        [HttpDelete("deleteProduct/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<Product>>> DeleteProductById(int id)
        {
            var dbProduct = await _context.Products.FindAsync(id);
            if (dbProduct == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "Product not found." }));
            }

            var userId = int.Parse(_userService.GetMyId());
            var checkUser = await _context.Accounts.FirstOrDefaultAsync(u => u.Id == userId);

            if (checkUser == null)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "User not found." }));
            }

            var cart = await _context.Carts.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.ProductId == id);

            if(cart == null)
            {
                _context.Products.Remove(dbProduct);
                await _context.SaveChangesAsync();
            }
            
            return Ok(await _context.Products.ToListAsync());
        }
    }
}
