$(document).ready(function () {
    var ListuniqueContact1 = [];
    var ListuniqueContact2 = [];
    var ListofUniqueEmailID = [];
    var ListofUniqueRollno = [];
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
            $("#rollno").prop("readonly", true);
            GetStudentDetails(ui.item.course);
            $("#searchprn").val(ui.item.course);
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
    });
    $("#addmarks").click(function () {
        ValidateMarkdetails();
    });
    $("#SaveDetails").click(function () {
        validateMandatoryfields();
    });
    $('#tablelistbody').on('click', '#removemarks', function () {
        // Find the closest 'tr' (table row) and remove it
        $(this).closest('tr').remove();
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
            ListuniqueContact1 = data.listuniqueContact1;
            ListuniqueContact2 = data.listuniqueContact2;
            ListofUniqueEmailID = data.listofUniqueEmailID;
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
            ListuniqueContact1 = data.listuniqueContact1;
            ListuniqueContact2 = data.listuniqueContact2;
            ListofUniqueEmailID = data.listofUniqueEmailID;
        }
    });
}
function ClearValues() {
    $("#searchprn").val("");
    $('#searchprn').removeClass('invalid-textbox');
    $("#studentname").val("");
    $('#studentname').removeClass('invalid-textbox');
    $("#studentaddress").val("");
    $('#studentaddress').removeClass('invalid-textbox');
    $("#parentcontact1").val("");
    $('#parentcontact1').removeClass('invalid-textbox');
    $("#parentcontact2").val("");
    $('#parentcontact2').removeClass('invalid-textbox');
    $("#studentemailID").val("");
    $("#rollno").val("");
    $('#rollno').removeClass('invalid-textbox');
    $("#classname").empty();
    $("#examtype").empty();
    $("#classnameid").val("");
    $("#examtypeid").val("");
    LoadClassExamDetails();
    $("#subject").empty();
    $("#subject").append("<option> --Select Subject-- </option>");
    $("#totalmarks").val("");
    $("#obtainedmarks").val("");
    $("#tablelistbody").empty();
    $("#searchprn").prop("readonly", false);
    $("#rollno").prop("readonly", false);
}
function GetSubjects() {
    var classid = $("#classnameid").val();
    var examtypeid = $("#examtypeid").val();
    var PRN = $("#searchprn").val();
    if (parseInt(classid) > 0 && parseInt(examtypeid) > 0 && parseInt(PRN) > 0 && PRN != "") {
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
                        + "</td><td>" + item.subjectName
                        + "</td><td>" + item.totalMarks
                        + "</td><td>" + item.obtainedMarks
                        + "</td><td>" + "<input type='button' class='form-control btn-danger' id='removemarks' value='X'/>"
                        + "</td></tr>";
                    $("#tablelistbody").append(row);
                });
                ListofUniqueRollno = data.listofUniqueRollno;
            }
        });
    } else {
        $("#subject").empty();
        $("#subject").append("<option> --Select Subject-- </option>");
        $("#rollno").val("");
    }
}
function GetSubjectsMarks(selectedValue) {
    $("#obtainedmarks").val("");
    $.ajax({
        url: "/Student/GetSubjectTotalMarks?SubjectID=" + selectedValue,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#totalmarks").val(data);
        }
    });
}
function ValidateMarkdetails() {
    var subject=$("#subject").val();
    var totalMarks=$("#totalmarks").val();
    var obtainedMarks = $("#obtainedmarks").val();
    //if (parseInt(subject) > 0 && subject != "--Select Subject--" && parseInt(totalMarks) > 0 && parseInt(obtainedMarks) > 0  && parseInt(obtainedMarks) <= parseInt(totalMarks)) {
    //    $('#addmarks').prop('disabled', false);
    //} else {
    //    $('#addmarks').prop('disabled', true);
    //}
    var isvalid = true;
    if (parseInt(subject) <= 0 || subject == "--Select Subject--") {
        alert("Please select Subject Name")
        isvalid = false;
    }
    else if (totalMarks == "") {
        alert("Please select Subject Name")
        isvalid = false;
    }
    else if (obtainedMarks == "") {
        alert("Please provide Marks")
        isvalid = false;
    }
    else if (parseInt(obtainedMarks) > parseInt(totalMarks)) {
        alert("Please provide correct Marks")
        isvalid = false;
    }
    else {
        var body = $("#tablelistbody tr");
        $.each(body, function () {
            var subjectID = $(this).find("td:eq(0)").text();
            if (subject == subjectID) {
                alert("Already Subject added on list");
                isvalid = false;
                return false;
            }
        });
    }
    if (isvalid) {
        AddMarksToList();
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
        + "</td><td>" + "<input type='button' class='form-control btn-danger' id='removemarks' value='X'/>"
        + "</td></tr>";
    $("#tablelistbody").append(row);
    $("#obtainedmarks").val("");
}
function validateMandatoryfields() {
    var isvalide = true;
    //Mandatory PRN
    var prn = parseInt($("#searchprn").val()).toString();
    if (prn.length < 4 || $("#searchprn").val() == "") {
        $('#searchprn').addClass('invalid-textbox');
        isvalide = false;
    } else {
        $('#searchprn').removeClass('invalid-textbox');
    }

    //Mandatory Student Name
    if ($("#studentname").val() == "") {
        $('#studentname').addClass('invalid-textbox');
        isvalide = false;
    } else {
        $('#studentname').removeClass('invalid-textbox');
    }

    //Mandatory Student Address
    if ($("#studentaddress").val() == "") {
        $('#studentaddress').addClass('invalid-textbox');
        isvalide = false;
    } else {
        $('#studentaddress').removeClass('invalid-textbox');
    }

    //Mandatory contact 1
    if ($("#parentcontact1").val() == "") {
        $("#parentcontact1").addClass('invalid-textbox');
        isvalide = false;
    } else {
        var contact1 = parseInt($("#parentcontact1").val()).toString();
        if (contact1.length < 10 || contact1.length > 10) {
            $('#parentcontact1').addClass('invalid-textbox');
            isvalide = false;
        } else {
            $('#parentcontact1').removeClass('invalid-textbox');
        }

    } 
    
    //invalid contact 2
    if ($("#parentcontact2").val() != "") {
        var contact2 = parseInt($("#parentcontact2").val()).toString();
        if (contact2.length < 10 || contact2.length > 10) {
            $('#parentcontact2').addClass('invalid-textbox');
            isvalide = false;
        } else {
            $('#parentcontact2').removeClass('invalid-textbox');
        }
    } else {
        $('#parentcontact2').removeClass('invalid-textbox');
    }

    //Mandatory Roll no
    if ($("#rollno").val() == "") {
        $('#rollno').addClass('invalid-textbox');
        isvalide = false;
    } else {
        $('#rollno').removeClass('invalid-textbox');
    }

    if (ListuniqueContact1 != null) {
        if (ListuniqueContact1.includes(contact1)) {
            alert("Provided contact number already present on database")
            $('#parentcontact1').addClass('invalid-textbox');
            return false;
        }
    }

    if (ListuniqueContact2 != null) {
        if (ListuniqueContact2.includes(contact2)) {
            alert("Provided contact number already present on database")
            $('#parentcontact2').addClass('invalid-textbox');
            return false;
        }
    }
    
    if (ListofUniqueEmailID != null) {
        if (ListofUniqueEmailID.includes($("#studentemailID").val())) {
            alert("Provided Email address already present on database")
            $('#studentemailID').addClass('invalid-textbox');
            return false;
        }
    }

    if (ListofUniqueRollno != null) {
        if (ListofUniqueRollno.includes($("#rollno").val())) {
            alert("Provided Roll no already present on database")
            return false;
        }
    }
    
    if (isvalide) {
        SaveStudentDetails();
    } else {
        alert("Please provide correct data for highlighted info.")
    }
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
        studentMarks.ObtainedMarks = Marks;
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
            if (data == 0) {
                alert("There some issue for saving data");
            } else if (data == 1) {
                alert("Student details has been saved successfully");
                ClearValues();
            }
        }
    });
}
