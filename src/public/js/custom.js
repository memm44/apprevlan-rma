
$(document).ready(function(){ 
  function guardainfo () {
    var caso= $('#ucaso').val();
  var tienda = $('#utienda').val();
    
  }   
    $("#formcaso").on("submit", function () { 
      
      var resp= prompt("desea continuar agregando articulos al caso "+caso+"?")
      if (resp=="s"){
        guardainfo();
      }else{
        return false;
      }

    });
    
});
 