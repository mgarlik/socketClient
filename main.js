var readlineSync = require('readline-sync');
var colors = require('colors');
var net = require('net');

var HOST = "192.168.2.150";
var PORT = "7717";

var client = null;

function OpenConnection(){
  if(client){
    console.log("-- Connection already open --".red);
    setTimeout(function(){
      menu();
    }, 0);
    return;
  }

  client = new net.Socket();

  client.on("error", function(err){
    client.destroy();
    client = null;
    console.log("ERROR: Nelze otevrit: %s".red, err.message);
    setTimeout(function(){
      menu();
    }, 0);
  });

  client.on("data", function(data){
    console.log("RECEIVED: %s".cyan, data);
    setTimeout(function(){
      menu();
    }, 0);
  });

  client.connect(PORT, HOST, function(){
    console.log("Connection uspesne otevreno".green);
    setTimeout(function(){
      menu();
    }, 0);
  });
}

function SendData(data){
    if(!client){
      console.log("Connection neni otevrene");
      setTimeout(function(){
        menu();
      }, 0);
      return;
    }
    console.log('Posilam:');
    console.log(data);
    client.write(data, 'ascii');
    setTimeout(function(){
      menu();
    }, 0);
}

function CloseConnection(){
  if(!client){
    console.log("Connection neni otevrene. Nemuzu ho tedy zavrit.");
    setTimeout(function(){
      menu();
    }, 0);
    return;
  }
  client.destroy();
  client = null;
  console.log("Connection uzavrene uspesne.".yellow);
  setTimeout(function(){
    menu();
  }, 0);
}

function menu(){
  var lineRead = readlineSync.question("\n\nEnter option (1 - Open, 2 - Send, 3 - Close, 4 - Quit, 5 - Posli spec): ");
  switch(lineRead){
    case "1":
      console.log("Option 1");
      OpenConnection();
      setTimeout(function(){
        menu();
      }, 0);
      break;
    case "2":
      console.log("Option 2");
      var data = readlineSync.question("Enter data to send: ");
      SendData(data);
      setTimeout(function(){
        menu();
      }, 0);
      break;
    case "3":
      console.log("Option 3");
      CloseConnection();
      setTimeout(function(){
        menu();
      }, 0);
      break;
    case "4":
      console.log("Option 4");
      break;
    case "5":
    var reqBegin = 0x02;
    var separator = 0x1C;
    var reqEnd = 0x03;
    var t1 = "B101        10051313261100000011A5A5";
    var t2 = "T00";
    var t3 = "B100";
    var t4 = "E203";
    var t5 = "D1";
    var bufSize = 55;

    var buffer = new Buffer(bufSize);

    // store first byte on index 0;
    buffer.writeUInt8(reqBegin, 0);
    buffer.write(t1, 1, 36, 'ascii');
    buffer.writeUInt8(separator, 37);
    buffer.write(t2, 38, 3, 'ascii');
    buffer.writeUInt8(separator, 41);
    buffer.write(t3, 42, 4, 'ascii');
    buffer.writeUInt8(separator, 46);
    buffer.write(t4, 47, 4, 'ascii');
    buffer.writeUInt8(separator, 51);
    buffer.write(t5, 52, 2, 'ascii');
    buffer.writeUInt8(reqEnd, 54);
    console.log(buffer);
    SendData(buffer);

      break;
    default:
      setTimeout(function(){
        menu();
      }, 0);
      break;
  }
}

setTimeout(function(){
  menu();
}, 0);
