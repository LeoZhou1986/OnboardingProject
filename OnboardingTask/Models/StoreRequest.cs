namespace OnboardingTask.Models
{
    public class StoreRequest
    {
        public StoreRequest(Store store, TableFormat tableFormat)
        {
            this.Store = store;
            this.TableFormat = tableFormat;
        }

        public Store Store { get; set; }
        public TableFormat TableFormat { get; set; }
    }
}
