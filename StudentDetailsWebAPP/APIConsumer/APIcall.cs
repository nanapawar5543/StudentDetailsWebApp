using Newtonsoft.Json;
using StudentDetailsWebAPP.Controllers;
using System.Text;
using System.Text.Json.Serialization;

namespace StudentDetailsWebAPP.APIConsumer
{
    public class APIcall
    {
        //private readonly HttpClient _httpClient;
        public APIcall()
        {
            //_httpClient = new HttpClient();
        }
        
        public async Task<dynamic> GetAPIMethod(string URL)
        {
            dynamic dym = null;

            using(var _httpClient=new HttpClient())
            {
                _httpClient.BaseAddress = new Uri("http://localhost:5239");
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                HttpResponseMessage responce=await _httpClient.GetAsync(URL);
                if(responce.IsSuccessStatusCode) { 
                    var result= await responce.Content.ReadAsStringAsync();
                    dym=JsonConvert.DeserializeObject<dynamic>(result);
                }
            }
            return dym;
        }

        public async Task<dynamic> CommonAPIMethod(string URL,string Httptype,dynamic data)
        {
            dynamic dym = null;

            using (var _httpClient = new HttpClient())
            {
                _httpClient.BaseAddress = new Uri("http://localhost:5239");
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("ContentType", "application/json");
                HttpResponseMessage responce = null ;
                switch (Httptype)
                {
                    case "GET":
                         responce = await _httpClient.GetAsync(URL);
                        break;
                    case "POST":
                        string message = "Hello, this is a sample message.";
                        HttpContent stringContent = new StringContent(message, Encoding.UTF8, "text/plain");
                        responce = await _httpClient.PostAsync(URL, stringContent);
                        break;
                     default: break;
                }
                if (responce.IsSuccessStatusCode)
                {
                    var result = await responce.Content.ReadAsStringAsync();
                    dym = JsonConvert.DeserializeObject<dynamic>(result);
                }
            }
            return dym;
        }
    }
}