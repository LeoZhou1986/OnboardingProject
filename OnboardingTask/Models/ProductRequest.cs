namespace OnboardingTask.Models
{
    public class ProductRequest
    {
        public ProductRequest(Product product, TableFormat tableFormat)
        {
            this.Product = product;
            this.TableFormat = tableFormat;
        }

        public Product Product { get; set; }
        public TableFormat TableFormat { get; set; }
    }
}
