using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnboardingTask.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Price { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
