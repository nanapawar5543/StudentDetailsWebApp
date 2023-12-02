using Microsoft.AspNetCore.Mvc;

namespace StudentDetailsWebAPP.Controllers
{
    public abstract class BaseController : Controller
    {
        public string StudentAPIURL { get; set; }

        public BaseController()
        {
            StudentAPIURL = "http://localhost:5239/Api/Student";
        }
    }
}
