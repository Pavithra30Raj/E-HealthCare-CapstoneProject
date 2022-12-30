namespace E_HealthCareApp_FSDProject.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; } = 0;
        public int ProductId { get; set; } = 0;
        public int Quantity { get; set; } = 0;
        public double TotalPrice { get; set; } = 0;
    }
}
