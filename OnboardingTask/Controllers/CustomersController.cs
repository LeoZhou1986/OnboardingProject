using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly OnboardingTaskContext _context = new OnboardingTaskContext();

        // GET: api/Customers/Index
        [HttpGet("[action]")]
        public ActionResult Index(int tableSize, string sortColumn, bool asc, int currentPage)
        {
            return Ok(new Message(true, "Success", GetCustomers(tableSize, sortColumn, asc, currentPage)));
        }
        // GET: api/Customers/Delete/5
        [HttpGet("[action]/{id}")]
        public ActionResult Delete(int id, int tableSize, string sortColumn, bool asc, int currentPage)
        {
            var customer = _context.Customer.Find(id);
            if (customer == null) return NotFound();
            
            _context.Customer.Remove(customer);
            _context.SaveChanges();
            return Ok(new Message(true, "Success", GetCustomers(tableSize, sortColumn, asc, currentPage)));
        }

        // POST: api/Customers/Edit
        [HttpPost("[action]")]
        public ActionResult Edit([FromBody] CustomerRequest request)
        {
            var customer = request.Customer;
            _context.Entry(customer).State = EntityState.Modified;
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true, 
                "Success", 
                GetCustomers(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        // POST: api/Customers/Create
        [HttpPost("[action]")]
        public ActionResult Create([FromBody] CustomerRequest request)
        {
            var customer = request.Customer;
            _context.Customer.Add(customer);
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetCustomers(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        private object GetCustomers(
            int tableSize,
            string sortColumn, 
            bool asc = false,
            int currentPage = 0
            )
        {

            //var context = new OnboardingTaskContext();
            var customers = _context.Customer;

            IOrderedQueryable<Customer> result;
            switch (sortColumn)
            {
                case "name":
                    result = asc ? customers.OrderBy(x=>x.Name) : customers.OrderByDescending(x=>x.Name);
                    break;
                case "address":
                    result = asc ? customers.OrderBy(x => x.Address) : customers.OrderByDescending(x => x.Address);
                    break;
                default:
                    result = asc ? customers.OrderBy(x => x.Id) : customers.OrderByDescending(x => x.Id);
                    break;
            }

            IEnumerable<Customer> returnCustomers;
            int totalPages;
            if (tableSize > 0)
            {
                var count = customers.Count();
                totalPages = count / tableSize + ((count % tableSize) > 0 ? 1 : 0);
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;
                returnCustomers = result.Skip(tableSize * (currentPage - 1)).Take(tableSize).ToList();
            }
            else
            {
                totalPages = 1;
                currentPage = 1;
                returnCustomers = result.ToList();
            }
            /*var columns = _context.Model.FindEntityType(typeof(Customer))
                .GetProperties().Select(x => x.Relational().ColumnName)
                .ToList().ConvertAll(d => d.ToLower());*/
            var obj = new {
                //columns = columns,
                rowData = returnCustomers,
                totalPages = totalPages,
                currentPage = currentPage,
                sortColumn = sortColumn,
                asc = asc
            };
            return obj;
        }
    }
}
