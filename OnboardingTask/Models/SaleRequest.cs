namespace OnboardingTask.Models
{
    public class SaleRequest
    {
        public SaleRequest(Sales sale, TableFormat tableFormat)
        {
            this.Sale = sale;
            this.TableFormat = tableFormat;
        }

        public Sales Sale { get; set; }
        public TableFormat TableFormat { get; set; }
    }
}
