using System.ComponentModel.DataAnnotations;

namespace E_HealthCareApp_FSDProject.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        [StringLength(30, ErrorMessage = "Product name length can't be more than 30.")]
        public string Name { get; set; } = string.Empty;
        [StringLength(20, ErrorMessage = "Company name length can't be more than 20.")]
        public string CompanyName { get; set; } = string.Empty;
        [Required]
        public double Price { get; set; } = 0;
        [Required]
        public int Quantity { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
        public string Uses { get; set; } = string.Empty;
        [Required]
        public string ExpireDate { get; set; } = string.Empty;
    }
}
