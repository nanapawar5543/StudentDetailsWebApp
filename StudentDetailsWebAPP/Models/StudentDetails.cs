using Microsoft.AspNetCore.Mvc.Rendering;

namespace StudentDetailsWebAPP.Models
{
    public class StudentDetails
    {
        public string? PRN { get; set; }
        public string? studentName { get; set; }
        public string? studentAddress { get; set; }
        public string? ParentContact1 { get; set; }
        public string? ParentContact2 { get; set; }
        public string? studentEmailID { get; set; }
        public int? ClassMasterID { get; set; }
        public string? ClassName { get; set; }
        public int? ExamMasterID { get; set; }
        public string? ExamName { get; set; }
        public int? Rollno { get; set; }

        public List<SelectListItem>? ListofClassNames { get; set; }
        public List<SelectListItem>? ListofExamTypes { get; set; }

        public List<StudentMarks>? ListofStudentMarks { get; set; }
    }
}
