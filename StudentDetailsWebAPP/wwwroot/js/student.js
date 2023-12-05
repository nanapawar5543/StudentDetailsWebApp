$(document).ready(function () {
    $("#rollno").prop("readonly", false);
    LoadClassExamDetails();
    $("#clearvalues").click(function () {
        ClearValues();
    });
    $("#searchprn").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/Student/GetPRNDetails",
                type: "POST",
                dataType: "json",
                data: { prnno: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.studentName, value: item.prn, course: item.prn };
                    }))
                }
            })
        },
        messages: {
            noResults: "", results: ""
        },
        select: function (event, ui) {
            $("#searchprn").prop("readonly", true);
            GetStudentDetails(ui.item.course);
            GetSubjects();
        }
    });
    $('#classname').change(function () {
        $("#totalmarks").val("");
        $("#obtainedmarks").val("");
        var selectedValue = $(this).val();
        $("#classnameid").val(selectedValue);
        GetSubjects();
    });
    $('#examtype').change(function () {
        $("#totalmarks").val("");
        $("#obtainedmarks").val("");
        var selectedValue = $(this).val();
        $("#examtypeid").val(selectedValue);
        GetSubjects();
    });
    $('#subject').change(function () {
        var selectedValue = $(this).val();
        var subjectName = $(this).find('option:selected').text();
        $("#subjectName").val(subjectName);
        GetSubjectsMarks(selectedValue);
        EnableAddButton();
    });
    $("#addmarks").click(function () {
        AddMarksToList();
    });
    $("#SaveDetails").click(function () {
        SaveStudentDetails();
    });
});
function GetStudentDetails(prnno) {
    $.ajax({
        url: "/Student/GetStudentDetails?prnno=" + prnno,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#studentname").val(data.studentName);
            $("#studentaddress").val(data.studentAddress);
            $("#parentcontact1").val(data.parentContact1);
            $("#parentcontact2").val(data.parentContact2);
            $("#studentemailID").val(data.studentEmailID);
            //if (data.classMasterID != null) {
            //    $("#classname").value(data.classMasterID);
            //    $("#classname").text(data.className);
            //}
            //if (data.examMasterID != null) {
            //    $("#examtype").value(data.examMasterID);
            //    $("#examtype").text(data.examName);
            //}
            $("#Rollno").val(data.rollno);
        }
    });
}
function LoadClassExamDetails() {
    $.ajax({
        url: "/Student/LoadClassExamDetails",
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#classname").append("<option> --Select class-- </option>");
            $.each(data.listofClassNames, function (key, item) {
                $("#classname").append($("<option>", {
                    value: item.value,
                    text: item.text
                }));
            });
            $("#examtype").append("<option> --Select Exam type-- </option>");
            $.each(data.listofExamTypes, function (key, item) {
                $("#examtype").append($("<option>", {
                    value: item.value,
                    text: item.text
                }));
            });
        }
    });
}
function ClearValues() {
    $("#searchprn").val("");
    $("#studentname").val("");
    $("#studentaddress").val("");
    $("#parentcontact1").val("");
    $("#parentcontact2").val("");
    $("#studentemailID").val("");
    $("#Rollno").val("");
    
    $("#searchprn").prop("readonly", false);
}
function GetSubjects() {
    var classid = $("#classnameid").val();
    var examtypeid = $("#examtypeid").val();
    var PRN = $("#searchprn").val();
    if (parseInt(classid) > 0 && parseInt(examtypeid) > 0 && parseInt(PRN) >0 && PRN != "") {
        $.ajax({
            url: "/Student/GetSubjectDetails?ClassID=" + classid + "&ExamTypeID=" + examtypeid + "&PRN=" + PRN,
            type: "GET",
            dataType: "json",
            success: function (data) {
                $("#rollno").val(data.rollno);
                if (data.rollno > 0) {
                    $("#rollno").prop("readonly", true);
                } else {
                    $("#rollno").prop("readonly", false);
                }
                $("#subject").empty();
                $("#subject").append("<option> --Select Subject-- </option>");
                $.each(data.listSubjectMasters, function (key, item) {
                    $("#subject").append($("<option>", {
                        value: item.subjectID,
                        text: item.subjectName
                    }));
                });
                $("#tablelistbody").empty();
                $.each(data.listStudentMarks, function (key, item) {
                    var row = "<tr><td>" + item.subjectID
                        + "</td><td>" + item.SubjectName
                        + "</td><td>" + item.TotalMarks
                        + "</td><td>" + item.ObtainedMarks
                        + "</td><td>" + "<input type='button' class='form-control btn-danger' id='removemarks' value='X' onclick='removerow();'/>"
                        + "</td></tr>";
                    $("#tablelistbody").append(row);
                });
            }
        });
    }
}
function GetSubjectsMarks(selectedValue) {
    $.ajax({
        url: "/Student/GetSubjectTotalMarks?SubjectID=" + selectedValue,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#totalmarks").val(data);
        }
    });
}
function EnableAddButton() {
    var subject=$("#subject").val();
    var totalMarks=$("#totalmarks").val();
    var obtainedMarks = $("#obtainedmarks").val();
    if (parseInt(subject) > 0 && subject != "--Select Subject--" && parseInt(totalMarks) > 0 && parseInt(obtainedMarks) > 0  && parseInt(obtainedMarks) <= parseInt(totalMarks)) {
        $('#addmarks').prop('disabled', false);
    } else {
        $('#addmarks').prop('disabled', true);
    }
}
function AddMarksToList() {
    var subjectID = $("#subject").val();
    var subjectName = $("#subjectName").val();
    var totalMarks=$("#totalmarks").val();
    var obtainedMarks = $("#obtainedmarks").val();
    var row = "<tr style='height: 10px;'><td>" + subjectID
        + "</td><td>" + subjectName
        + "</td><td>" + totalMarks
        + "</td><td>" + obtainedMarks
        + "</td><td>" + "<input type='button' class='form-control btn-danger' id='removemarks' value='X' onclick='removerow();'/>"
        + "</td></tr>";
    $("#tablelistbody").append(row);

}
function SaveStudentDetails() {
    var PRN=$("#searchprn").val();
    var studentName=$("#studentname").val();
    var studentAddress=$("#studentaddress").val();
    var parentContact1=$("#parentcontact1").val();
    var parentContact2 =$("#parentcontact2").val();
    var StudentEmailID = $("#studentemailID").val();
    var className = $("#classname").val();
    var examName = $("#examtype").val();
    var rollNo = $("#rollno").val();
    var studentdetails = {};
    studentdetails.PRN = PRN;
    studentdetails.studentName = studentName;
    studentdetails.studentAddress = studentAddress;
    studentdetails.ParentContact1 = parentContact1;
    studentdetails.ParentContact2 = parentContact2;
    studentdetails.studentEmailID = StudentEmailID;
    studentdetails.ClassMasterID = className;
    studentdetails.ExamMasterID = examName;
    studentdetails.Rollno = rollNo;
    var ListofStudentMarks = [];
    var body = $("#tablelistbody tr");
    $.each(body, function () {
        var subjectID = $(this).find("td:eq(0)").text();
        var subject = $(this).find("td:eq(1)").text();
        var Marks = $(this).find("td:eq(3)").text();
        var studentMarks = {};
        studentMarks.subjectID = subjectID;
        studentMarks.Marks = Marks;
        ListofStudentMarks.push(studentMarks);
    });
    studentdetails.ListofStudentMarks = ListofStudentMarks;
    var data = JSON.stringify(studentdetails);
    $.ajax({
        async: true,
        url: "/Student/SaveStudentDetails",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: data,
        success: function (data) {
            
        }
    });
}
