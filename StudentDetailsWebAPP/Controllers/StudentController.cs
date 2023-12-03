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
        [HttpGet]
        public async Task<JsonResult> GetSubjectDetails(int ClassID)
        {
            if (ClassID > 0)
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?ClassID=" + ClassID;
                    string methodName = "/GetSubjectDetails";
                    HttpResponseMessage response = await client.GetAsync(base.StudentAPIURL + methodName + queryString);
                    var result = response.Content.ReadAsStringAsync().Result;
                    var data = JsonConvert.DeserializeObject<List<SubjectMaster>>(result);
                    return Json(data);
                }
            }
            return null;
        }
        [HttpGet]
        public async Task<JsonResult> GetSubjectTotalMarks(int SubjectID)
        {
            if (SubjectID > 0)
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?SubjectID=" + SubjectID;
                    string methodName = "/GetSubjectTotalMarks";
                    HttpResponseMessage response = await client.GetAsync(base.StudentAPIURL + methodName + queryString);
                    var result = response.Content.ReadAsStringAsync().Result;
                    int Marks = JsonConvert.DeserializeObject<int>(result);
                    return Json(Marks);
                }
            }
            return null;
        }
        [HttpPost]
        public async Task<JsonResult> SaveStudentDetails(StudentDetails studentdetails)
        {
            if (studentdetails != null)
            {
                using (HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    string queryString = "?SubjectID=";
                    string methodName = "/GetSubjectTotalMarks";
                    HttpResponseMessage response = await client.GetAsync(base.StudentAPIURL + methodName + queryString);
                    var result = response.Content.ReadAsStringAsync().Result;
                    int Marks = JsonConvert.DeserializeObject<int>(result);
                    return Json(Marks);
                }
            }
            return null;
        }
        
    }
}