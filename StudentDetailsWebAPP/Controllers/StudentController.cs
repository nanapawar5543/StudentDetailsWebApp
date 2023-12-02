using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StudentDetailsWebAPP.APIConsumer;
using StudentDetailsWebAPP.Models;

namespace StudentDetailsWebAPP.Controllers
{
    public class StudentController : BaseController
    {
        APIcall apicall;
        public StudentController()
        {
            apicall = new APIcall();
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> GetPRNDetails(string prnno)
        {
            using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
            {
                string queryString = "?prnno=" + prnno;
                string methodName = "/GetPRNDetails";
                HttpResponseMessage response = await client.GetAsync(base.StudentAPIURL + methodName + queryString);
                var result = response.Content.ReadAsStringAsync().Result;
                var data = JsonConvert.DeserializeObject<List<PRNModel>>(result);
                return Json(data);
            }
        }
        [HttpGet]
        public async Task<JsonResult> LoadClassExamDetails()
        {
            using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
            {
                string queryString = "";
                string methodName = "/LoadClassExamDetails";
                HttpResponseMessage response = await client.GetAsync(base.StudentAPIURL + methodName + queryString);
                var result = response.Content.ReadAsStringAsync().Result;
                var data = JsonConvert.DeserializeObject<StudentDetails>(result);
                return Json(data);
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetStudentDetails(string prnno)
        {
            using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
            {
                string queryString = "?prnno=" + prnno;
                string methodName = "/GetStudentDetails";
                HttpResponseMessage response = await client.GetAsync(base.StudentAPIURL + methodName + queryString);
                var result = response.Content.ReadAsStringAsync().Result;
                var data = JsonConvert.DeserializeObject<StudentDetails>(result);
                return Json(data);
            }
        }
    }
}