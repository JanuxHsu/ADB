function auth() {
  if (arguments.callee._singletonInstance){
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;

  var token = function(){
    var access;
    try {
      access = JSON.parse(getCookie('auth'));
    } catch (e) {

    } finally {
      return access.token;
    }
  };

  this.Tologout = function(){
    eraseCookie('auth');
    var LoginUrl =  location.protocol + "//" + location.host+'/login';
    return LoginUrl;
  };

  this.goBack = function(prev_url){
    var url =  location.protocol + "//" + location.host;
    var LoginUrl =  location.protocol + "//" + location.host+'/login';
    if(prev_url == LoginUrl){
      return url;
    }
    return prev_url;
  };

  this.getToken = function(){
    var array = [];
    array.push(token());
    return array;
  };

}

function createCookie(name, value, days) {
  var expires;
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }
  else {
      expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

//Destroy Cookie
function eraseCookie(c_name) {
  createCookie(c_name,"",-1);
}

//Read Cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

//console.log(getCookie('auth'));
//Auth Ajax
function sendLogin(data, callback){
  $.ajax({
    url:'api/auth/login',
    method : 'POST',
    data : data,
    dataType : 'JSON',
    success : function(data){
      callback(data);
    },
    error : function(error){
      callback(error);
    }
  });
}

//messageBox Handle
function messageBox(type, msg){
  var cssSet;
  var text;
  switch (type) {
    case 'info':
      text = msg;
      cssSet = {
          "border" : "2px solid rgb(8, 156, 0)",
          "background-color" : "rgb(53, 96, 56)",
          "color" : "#FFFFFF"
      };
      break;
    case 'error':
      text = "Error:  "+msg
      cssSet = {
          "border" : "2px solid rgb(245, 35, 35)",
          "background-color" : "rgb(240, 93, 93)",
          "color" : "#FFFFFF"
      };
      break;

    default:
      console.log("sick");
  }
  $('#login-message').css(cssSet).html(text).show();
  setTimeout(function () {
    $('#login-message').hide();
  }, 2000);
}

//validation
var validation = function(account, password){
  var authPack = {
      account : account,
      password : password
  };

  if (account == "" || password == "") {
    return false;
  } else {
    sendLogin(authPack, function(data){
      if (data.token) {
        messageBox('info', data.statusText);
        createCookie('auth', JSON.stringify(data), 1);
      } else {
        messageBox('error', data.statusText);
      }
      window.location.replace(document.referrer);
    });
  }
  return true;
};

$( document ).ready(function() {

  $(document).on('click', '.next', function(e){
    var url = "http://" + window.location.host + '/SQL';
    console.log(url);
    location.href = url;
  });

  function goConnect(){
    $.ajax({
      url:'api/auth',
      method : 'POST',
      data : {
        uid : $('.UID').val(),
        pwd : $('.PWD').val()
      },
      dataType : 'JSON',
      success : function(data){
        if (data.connected) {
          $('.codeBox').html('<pre style="border:0px; color:#FFF; background-color:rgba(0,0,0,0.5);" class="prettyprint fadeIn fade-in">' + JSON.stringify(data, null, "\t") + '</pre><button class="next fadeIn fade-in two">NEXT</button>');
        } else {
          $('.codeBox').html('<pre style="border:0px; color:#FFF; background-color:rgba(0,0,0,0.5);" class="prettyprint fadeIn fade-in">' + JSON.stringify(data, null, "\t") + '</pre>');
        }
      },
      error : function(error){
        console.log(error);
      }
    });
  }

  $(document).keypress(function(e) {
    if(e.which == 13) {
      goConnect();
    }
  });

  $('.login').click(function(){
    goConnect();
  });
});
