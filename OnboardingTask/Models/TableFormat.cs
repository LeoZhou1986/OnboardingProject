using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnboardingTask.Models
{
    public class TableFormat
    {
        public TableFormat(int tableSize, string sortColumn, bool asc, int currentPage)
        {
            this.TableSize = tableSize;
            this.SortColumn = sortColumn;
            this.Asc = asc;
            this.CurrentPage = currentPage;
        }

        public int TableSize { get; set; }
        public string SortColumn { get; set; }
        public bool Asc { get; set; }
        public int CurrentPage { get; set; }
    }
}
