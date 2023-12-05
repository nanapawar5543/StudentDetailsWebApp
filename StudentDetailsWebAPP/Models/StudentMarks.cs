using Microsoft.AspNetCore.Mvc.Rendering;

namespace StudentDetailsWebAPP.Models
{
    public class StudentMarks
    {
        public int? subjectID { get; set; }
        public string? SubjectName { get; set; }
        public int? TotalMarks { get; set; }
        public int? ObtainedMarks { get; set; }
    }
}
