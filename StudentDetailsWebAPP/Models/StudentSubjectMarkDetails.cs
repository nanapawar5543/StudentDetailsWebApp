namespace StudentDetailsWebAPP.Models
{
    public class StudentSubjectMarkDetails
    {
        public int? Rollno { get; set; }
        public List<SubjectMaster>? ListSubjectMasters { get; set; }
        public List<StudentMarks>? ListStudentMarks { get; set; }
    }
}
