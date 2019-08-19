namespace OnboardingTask.Models
{
    public class CustomerRequest
    {
        public CustomerRequest(Customer customer, TableFormat tableFormat)
        {
            this.Customer = customer;
            this.TableFormat = tableFormat;
        }

        public Customer Customer { get; set; }
        public TableFormat TableFormat { get; set; }
    }
}
