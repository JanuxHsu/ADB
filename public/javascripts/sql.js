$( document ).ready(function() {


  $('.tableContent').on('click', '.r', function(e){
    $('.sqlBox').html('<textarea class="sql">SELECT * FROM student WHERE ID = ' + $(this).parent().attr('target_id') +'</textarea><button class="Do">Send</button>');
  });

  $('.tableContent').on('click', '.remove', function(e){
    $('.sqlBox').html('<textarea class="sql">DELETE FROM student WHERE ID = ' + $(this).attr('target_id') +'</textarea><button class="Do">Send</button>');
  });

  var NameTemp = "";
  var IDTemp = "";
  $('.Inname').keyup(function(e){
    NameTemp = $(this).val();
    var string = "INSERT INTO student (name, student_id) VALUES ('" + NameTemp +"', '"+ IDTemp +"')";
    $('.sqlBox').html("<textarea class='sql'>"+ string +"</textarea><button class='Do'>Send</button>");
  });

  $('.Insid').keyup(function(e){
    IDTemp = $(this).val();
    var string = "INSERT INTO student (name, student_id) VALUES ('" + NameTemp +"', '"+ IDTemp +"')";
    $('.sqlBox').html("<textarea class='sql'>"+ string +"</textarea><button class='Do'>Send</button>");
  });

  $('.sqlBox').on('click', '.Do', function(e){
    $.ajax({
      url:'api/sql',
      method : 'POST',
      data : {
        sqlString : $('.sql').val()
      },
      dataType : 'JSON',
      success : function(data){
        $('.sqlBox').html('<pre style="border:0px; color:#FFF; background-color:rgba(0,0,0,0.5);" class="prettyprint fadeIn fade-in">' + JSON.stringify(data, null, "\t") + '</pre>');
        if(data.status == 'success'){
          setTimeout(function(){
            location.reload();
          }, 2000);
        }
      },
      error : function(error){
        console.log(error);
      }
    });
  });
});
