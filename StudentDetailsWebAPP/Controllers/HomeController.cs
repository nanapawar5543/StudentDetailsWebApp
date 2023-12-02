using Microsoft.AspNetCore.Mvc;
using StudentDetailsWebAPP.APIConsumer;
using StudentDetailsWebAPP.Models;
using System.Diagnostics;
using System.Dynamic;

namespace StudentDetailsWebAPP.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        APIcall apicall;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            apicall=new APIcall();
        }

        public async Task<IActionResult> Index()
        {
            var result =await apicall.GetAPIMethod("/api/Student/GetDetails");

            dynamic obj = new ExpandoObject();
            obj.Name = "Nana";
            obj.address = "Waiphale";
            var Postresult = await apicall.CommonAPIMethod("/api/Student/PostDetails", "POST", obj);
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}