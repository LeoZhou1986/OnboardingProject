using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly OnboardingTaskContext _context = new OnboardingTaskContext();
        public ProductsController(OnboardingTaskContext context)
        {
            _context = context;
        }
        // GET: api/Products/Index
        [HttpGet("[action]")]
        public ActionResult Index(int tableSize, string sortColumn, bool asc, int currentPage)
        {
            return Ok(new Message(true, "Success", GetProducts(tableSize, sortColumn, asc, currentPage)));
        }
        // GET: api/Products/Delete/5
        [HttpGet("[action]/{id}")]
        public ActionResult Delete(int id, int tableSize, string sortColumn, bool asc, int currentPage)
        {
            var product = _context.Product.Find(id);
            if (product == null) return NotFound();

            _context.Product.Remove(product);
            _context.SaveChanges();
            return Ok(new Message(true, "Success", GetProducts(tableSize, sortColumn, asc, currentPage)));
        }

        // POST: api/Products/Edit
        [HttpPost("[action]")]
        public ActionResult Edit([FromBody] ProductRequest request)
        {
            var product = request.Product;
            _context.Entry(product).State = EntityState.Modified;
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetProducts(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        // POST: api/Products/Create
        [HttpPost("[action]")]
        public ActionResult Create([FromBody] ProductRequest request)
        {
            var product = request.Product;
            _context.Product.Add(product);
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetProducts(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        private object GetProducts(
            int tableSize,
            string sortColumn,
            bool asc = false,
            int currentPage = 0
            )
        {

            var products = _context.Product;

            IOrderedQueryable<Product> result;
            switch (sortColumn)
            {
                case "name":
                    result = asc ? products.OrderBy(x => x.Name) : products.OrderByDescending(x => x.Name);
                    break;
                case "price":
                    result = asc ? products.OrderBy(x => x.Price) : products.OrderByDescending(x => x.Price);
                    break;
                default:
                    result = asc ? products.OrderBy(x => x.Id) : products.OrderByDescending(x => x.Id);
                    break;
            }

            IEnumerable<Product> returnProducts;
            int totalPages;
            if (tableSize > 0)
            {
                var count = products.Count();
                totalPages = count / tableSize + ((count % tableSize) > 0 ? 1 : 0);
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;
                returnProducts = result.Skip(tableSize * (currentPage - 1)).Take(tableSize).ToList();
            }
            else
            {
                totalPages = 1;
                currentPage = 1;
                returnProducts = result.ToList();
            }
            var obj = new
            {
                rowData = returnProducts,
                totalPages = totalPages,
                currentPage = currentPage,
                sortColumn = sortColumn,
                asc = asc
            };
            return obj;
        }
    }
}
