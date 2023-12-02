$(document).ready(function () {
    LoadClassExamDetails();
    $("#clearvalues").click(function () {
        ClearValues();
    });
    $("#searchprn").autocomplete({
        source: function (request, response) {
            debugger
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
            GetStudentDetails(ui.item.course)
        }
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
