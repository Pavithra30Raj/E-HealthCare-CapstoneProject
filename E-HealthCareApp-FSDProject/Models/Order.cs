namespace E_HealthCareApp_FSDProject.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; } = 0;
        public string ProductNames { get; set; } = string.Empty;
        public double TotalPrice { get; set; } = 0;
        public string Status { get; set; } = string.Empty;
        public DateTime DateTime { get; set; } = DateTime.Now;
    }
}
