using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    public class StoresController : Controller
    {
        private readonly OnboardingTaskContext _context = new OnboardingTaskContext();

        // GET: api/Stores/Index
        [HttpGet("[action]")]
        public ActionResult Index(int tableSize, string sortColumn, bool asc, int currentPage)
        {
            return Ok(new Message(true, "Success", GetStores(tableSize, sortColumn, asc, currentPage)));
        }
        // GET: api/Stores/Delete/5
        [HttpGet("[action]/{id}")]
        public ActionResult Delete(int id, int tableSize, string sortColumn, bool asc, int currentPage)
        {
            var store = _context.Store.Find(id);
            if (store == null) return NotFound();

            _context.Store.Remove(store);
            _context.SaveChanges();
            return Ok(new Message(true, "Success", GetStores(tableSize, sortColumn, asc, currentPage)));
        }

        // POST: api/Stores/Edit
        [HttpPost("[action]")]
        public ActionResult Edit([FromBody] StoreRequest request)
        {
            var store = request.Store;
            _context.Entry(store).State = EntityState.Modified;
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetStores(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        // POST: api/Stores/Create
        [HttpPost("[action]")]
        public ActionResult Create([FromBody] StoreRequest request)
        {
            var store = request.Store;
            _context.Store.Add(store);
            _context.SaveChanges();

            var format = request.TableFormat;
            return Ok(new Message(true,
                "Success",
                GetStores(format.TableSize, format.SortColumn, format.Asc, format.CurrentPage)
                ));
        }

        private object GetStores(
            int tableSize,
            string sortColumn,
            bool asc = false,
            int currentPage = 0
            )
        {

            var stores = _context.Store;

            IOrderedQueryable<Store> result;
            switch (sortColumn)
            {
                case "name":
                    result = asc ? stores.OrderBy(x => x.Name) : stores.OrderByDescending(x => x.Name);
                    break;
                case "address":
                    result = asc ? stores.OrderBy(x => x.Address) : stores.OrderByDescending(x => x.Address);
                    break;
                default:
                    result = asc ? stores.OrderBy(x => x.Id) : stores.OrderByDescending(x => x.Id);
                    break;
            }

            IEnumerable<Store> returnStores;
            int totalPages;
            if (tableSize > 0)
            {
                var count = stores.Count();
                totalPages = count / tableSize + ((count % tableSize) > 0 ? 1 : 0);
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;
                returnStores = result.Skip(tableSize * (currentPage - 1)).Take(tableSize).ToList();
            }
            else
            {
                totalPages = 1;
                currentPage = 1;
                returnStores = result.ToList();
            }
            var obj = new
            {
                rowData = returnStores,
                totalPages = totalPages,
                currentPage = currentPage,
                sortColumn = sortColumn,
                asc = asc
            };
            return obj;
        }
    }
}