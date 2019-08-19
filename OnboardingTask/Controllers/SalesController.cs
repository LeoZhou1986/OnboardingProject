using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly OnboardingTaskContext _context = new OnboardingTaskContext();

        // GET: api/Sales/Index
        [HttpGet("[action]")]
        public ActionResult Index(int tableSize, string sortColumn, bool asc, int currentPage)
        {
            return Ok(new Message(true, "Success", GetSales(tableSize, sortColumn, asc, currentPage)));
        }
        // GET: api/Sales/Delete/5
        [HttpGet("[action]/{id}")]
        public ActionResult Delete(int id, int tableSize, string sortColumn, bool asc, int currentPage)
        {
            var sale = _context.Sales.Find(id);
            if (sale == null) return NotFound();

            _context.Sales.Remove(sale);
            _context.SaveChanges();
            return Ok(new Message(true, "Success", GetSales(tableSize, sortColumn, asc, currentPage)));
        }

        // GET: api/Sales/GetFieldOptions
        [HttpGet("[action]")]
        public ActionResult GetFieldOptions()
        {
            var options = new
            {
                customer = (from c in _context.Customer select new { value = c.Id, text = c.Name }).ToList(),
                customerKey = "customerId",
                product = (from p in _context.Product select new { value = p.Id, text = p.Name  }).ToList(),
                productKey = "productId",
                store = (from s in _context.Store select new { value = s.Id, text = s.Name}).ToList(),
                storeKey = "storeId",
                dataFormat = new string[] { "id", "customerId", "productId", "storeId", "dateSold" }
            };
            return Ok(new Message(true, "Success", options));
        }

        // POST: api/Sales/Edit
        [HttpPost("[action]")]
        public ActionResult Edit([FromBody] SaleRequest request)
        {
            var sale = request.Sale;
            _context.Entry(sale).State = EntityState.Modified;
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetSales(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        // POST: api/Sales/Create
        [HttpPost("[action]")]
        public ActionResult Create([FromBody] SaleRequest request)
        {
            var sale = request.Sale;
            _context.Sales.Add(sale);
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetSales(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        private object GetSales(
            int tableSize,
            string sortColumn,
            bool asc = false,
            int currentPage = 0
            )
        {
            var sales = (from sl in _context.Sales
                           join p in _context.Product
                           on sl.ProductId equals p.Id
                           join c in _context.Customer
                           on sl.CustomerId equals c.Id
                           join st in _context.Store
                           on sl.StoreId equals st.Id
                           select new
                           {
                               Id = sl.Id,
                               ProductId = sl.ProductId,
                               Product = p.Name,
                               CustomerId = sl.CustomerId,
                               Customer = c.Name,
                               StoreId = sl.StoreId,
                               Store = st.Name,
                               DateSold = sl.DateSold
                           });

            switch (sortColumn)
            {
                case "customer":
                    sales = asc ? sales.OrderBy(x => x.Customer) : sales.OrderByDescending(x => x.Customer);
                    break;
                case "product":
                    sales = asc ? sales.OrderBy(x => x.Product) : sales.OrderByDescending(x => x.Product);
                    break;
                case "store":
                    sales = asc ? sales.OrderBy(x => x.Store) : sales.OrderByDescending(x => x.Store);
                    break;
                default:
                    sales = asc ? sales.OrderBy(x => x.Id) : sales.OrderByDescending(x => x.Id);
                    break;
            }

            int totalPages;
            if (tableSize > 0)
            {
                var count = sales.Count();
                totalPages = count / tableSize + ((count % tableSize) > 0 ? 1 : 0);
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;
                sales = sales.Skip(tableSize * (currentPage - 1)).Take(tableSize);
            }
            else
            {
                totalPages = 1;
                currentPage = 1;
            }
            var obj = new
            {
                rowData = sales.ToList(),
                totalPages = totalPages,
                currentPage = currentPage,
                sortColumn = sortColumn,
                asc = asc
            };
            return obj;
        }
    }
}
