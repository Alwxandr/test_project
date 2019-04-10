
var small_data_button = document.querySelector(".small-data");
var big_data_button = document.querySelector(".big-data");
var table = document.querySelector("tbody");
var loader = document.querySelector(".overlay-loader");
var err_message = document.querySelector(".error-block");
var nav_block   = document.querySelector(".nav-block");
var search_block = document.querySelector(".search");
var out_block = document.querySelector(".out-data");
var current_page;
var data1;
var form = document.querySelector(".add-data");
var add_but = document.querySelector(".add-but");
var sub_form = document.querySelector(".sub-form");

small_data_button.onclick = function () {

    add_but.style.display = "none";
    form.style.display = "none";
    table.style.display = "none";
    loader.style.display = "block";
    err_message.style.display = "none";
    nav_block.style.display = "none";
    search_block.style.display = "none";

    if(document.querySelector(".cur_field")){
        document.querySelector(".cur_field").classList.remove("cur_field");
        out_block.style.display = "none";
    }

    test = httpGet('http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D').then(function (response) {

    }, function (error) {

        err_message.style.display = "block";
        err_message.innerHTML = "Rejected: ".concat(error);
        loader.style.display = "none";

    });

};

big_data_button.onclick = function () {


    add_but.style.display = "none";
    form.style.display = "none";
    table.style.display = "none";
    loader.style.display = "block";
    err_message.style.display = "none";
    nav_block.style.display = "none";
    search_block.style.display = "none";
    if(document.querySelector(".cur_field")){
        document.querySelector(".cur_field").classList.remove("cur_field");
        out_block.style.display = "none";
    }

    test = httpGet( 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)  xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D').then(function (response) {

    }, function (error) {

        err_message.style.display = "block";
        err_message.innerHTML = "Rejected: ".concat(error);
        loader.style.display = "none";

    });
};
//загрузка данных с сервера
function httpGet(url) {

    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function() {

            if (this.status == 200) {

                resolve(this.response);
                var data = JSON.parse(this.response);

                data1 = JSON.parse(this.response);
                load_table_data(data);

            } else {

                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function() {

            reject(new Error("Network Error"));

        };
       xhr.send();
    });
}
//отображение данных в таблице
function load_table_data(data) {

    var th = document.querySelector(".th1");
    var for_table = document.querySelector(".for-table");
    var arr;
    current_page = 1;


    var tdata = ['<tr id="thead"><th id="id">id<div class="s"></div></th><th id="firstName">firstName<div class="s"></div></th><th id="lastName">lastName<div class="s"></div></th><th id="email">email<div class="s"></div></th><th id="phone">phone<div class="s"></div></th></tr>'];

    if(data.length <= 50){
         arr = data;
         arr.forEach(function (v) {
            tdata.push('<tr id="'+ v.id +'"><td>' + v.id + '</td><td>' + v.firstName + '</td><td>' + v.lastName + '</td> <td>' + v.email + '</td><td>' + v.phone + ' </td></td></tr>');

        })
    }

    if(data.length > 50 )   {

        var last_elem = 49;
        arr = data.slice(0, 50);
        arr.forEach( function (v) {
            tdata.push('<tr id="'+ v.id +'"><td>' + v.id + '</td><td>' + v.firstName + '</td><td>' + v.lastName + '</td> <td>' + v.email + '</td><td>' + v.phone + ' </td></td></tr>');
        });
        nav_block.style.display = "inline-block";

        var counter = document.querySelector(".counter");

        change_counter(current_page);

        function change_counter(current_page){
            counter.innerHTML = current_page + " из " + Math.ceil(data.length / 50) ;
        };

    }

    table.style.display = "table";
    search_block.style.display = "block";
    table.innerHTML = tdata.join("");
    loader.style.display = "none";
    var search_but = document.querySelector(".search-but");

    nav_block.onclick = function (event) {
        change_page(event.target);
    }
    //Пользовательская навигация если больше 50 строк
    function change_page(but) {

        if(document.querySelector(".cur_field")){
            document.querySelector(".cur_field").classList.remove("cur_field");
            out_block.style.display = "none";
        }

        if (but.id === "left" && last_elem > 49){

            last_elem -= 50;
            console.log(last_elem -49  , last_elem );
            arr = data.slice(last_elem - 49 , last_elem );
            tdata = ['<tr id="thead"><th id="id">id<div class="s"></div></th><th id="firstName">firstName<div class="s"></div></th><th id="lastName">lastName<div class="s"></div></th><th id="email">email<div class="s"></div></th><th id="phone">phone<div class="s"></div></th></tr>'];
            arr.forEach( function (v) {
                tdata.push('<tr id="'+ v.id +'"><td>' + v.id + '</td><td>' + v.firstName + '</td><td>' + v.lastName + '</td> <td>' + v.email + '</td><td>' + v.phone + ' </td></td></tr>');
            });

            table.innerHTML = tdata.join("");
            change_counter(current_page -=1);

            thead = document.getElementById("thead");

            thead.onclick  = function (event) {
                console.log(thead);
                sort_by_field(event.target);

            }

        } else if(but.id === "right" && last_elem < data.length - 1){

            arr = data.slice(last_elem + 1 , last_elem + 51);
            last_elem += 50;
            tdata = ['<tr id="thead"><th id="id">id<div class="s"></div></th><th id="firstName">firstName<div class="s"></div></th><th id="lastName">lastName<div class="s"></div></th><th id="email">email<div class="s"></div></th><th id="phone">phone<div class="s"></div></th></tr>'];
            arr.forEach( function (v) {
                tdata.push('<tr id="'+ v.id +'"><td>' + v.id + '</td><td>' + v.firstName + '</td><td>' + v.lastName + '</td> <td>' + v.email + '</td><td>' + v.phone + ' </td></td></tr>');
            });

            table.innerHTML = tdata.join("");
            change_counter(current_page +=1);

            thead = document.getElementById("thead");

            thead.onclick  = function (event) {
                console.log(thead);
                sort_by_field(event.target);
            }
        }
    }

    search_but.onclick = function(){

        if(document.querySelector(".cur_field")){
            document.querySelector(".cur_field").classList.remove("cur_field");
            out_block.style.display = "none";
        }

        var input = document.querySelector(".search-field").value;

        if(input){

            var reg = new RegExp( input , "g");

            var filtered_arr = arr.filter(function (v) {

                return  reg.test(v.id) ||
                    reg.test(v.firstName) ||
                    reg.test(v.lastName) ||
                    reg.test(v.email) ||
                    reg.test(v.phone)
            });
            if(filtered_arr.length > 0 ){

                tdata = ['<tr id="thead"><th id="id">id<div class="s"></div></th><th id="firstName">firstName<div class="s"></div></th><th id="lastName">lastName<div class="s"></div></th><th id="email">email<div class="s"></div></th><th id="phone">phone<div class="s"></div></th></tr>'];

                filtered_arr.forEach( function (v) {
                    tdata.push('<tr id="'+ v.id +'"><td>' + v.id + '</td><td>' + v.firstName + '</td><td>' + v.lastName + '</td> <td>' + v.email + '</td><td>' + v.phone + ' </td></td></tr>');
                });
                table.innerHTML = tdata.join("");
                nav_block.style.display = "none";
            }else{
                table.innerHTML = "<b>Ничего не найдено</b>";
            }

        } else{
            alert("Введите данные для поиска");
        }
    };
    thead = document.getElementById("thead");

    thead.onclick  = function (event) {

        sort_by_field(event.target);

    }
    //сортировка данных по полю
    function sort_by_field (field) {

        var field_id = field.id;
        var direction = 0;
        var m = 0;

             arr.sort(function (a,b) {

                 if (a[field_id] > b[field_id]) {
                     return 1;
                 }

                 if(a[field_id] < b[field_id]){
                     m++;
                     return - 1 ;
                 }
                 else {
                     return 0;
                 }
             })

        if ( m === 0 ){
            direction = 1;
            arr.sort(function (a,b) {

                if (a[field_id] < b[field_id]) {
                    return 1;
                }

                if(a[field_id] > b[field_id]){
                    return - 1 ;
                }
                else {
                    return 0;
                }
            })
        }

        tdata = ['<tr id="thead"><th id="id">id<div class="s"></div></th><th id="firstName">firstName<div class="s"></div></th><th id="lastName">lastName<div class="s"></div></th><th id="email">email<div class="s"></div></th><th id="phone">phone<div class="s"></div></th></tr>'];

        arr.forEach( function (v) {
            tdata.push('<tr id="'+ v.id +'"><td>' + v.id + '</td><td>' + v.firstName + '</td><td>' + v.lastName + '</td> <td>' + v.email + '</td><td>' + v.phone + ' </td></td></tr>');
        });
        table.innerHTML = tdata.join("");

        thead = document.getElementById("thead");

        thead.onclick  = function (event) {

            sort_by_field(event.target);

        }
        sort_directions(field_id, direction);
    }
    //ф-я изменения стрелки указывающей порядок сортировки
    function sort_directions (field, direction){
        var cyr_field = document.getElementById(field);
        direction ===0 ? cyr_field.lastChild.innerHTML = "&darr;" : cyr_field.lastChild.innerHTML = "&uarr;";

    }
    //вывести данные о выведенном элементе

    table.onclick = function (event) {
        out_block.style.display = "block";
        current_id_elem = parseInt(event.target.parentElement.id);

        if(document.querySelector(".cur_field")){
            document.querySelector(".cur_field").classList.remove("cur_field")
        }

        event.target.parentElement.classList.add("cur_field");

        var current_line = arr.filter(function (v) {
            return v.id === current_id_elem;

        });

        var line = current_line[0];
        var out = [];

        for(var key in line){

            if (typeof line[key] === "object"){

               var inner_obj = line[key];

               for(key1 in inner_obj){

               }
            }

        }
        out = [ 'Выбран пользователь: <b>'+ line.firstName +" "+ line.lastName +' </b></br> ' +
                'Описание:<textarea>'+ line.description +' </textarea></br> ' +
                'Адрес проживания:<b>'+ line.address.streetAddress +' </b></br>' +
                'Город:<b>'+ line.address.city +' </b> </br>' +
                'Провинция/штат:<b>'+ line.address.state +' </b> </br>' +
                'Индекс:<b>'+ line.address.zip +' </b> '];

        out_block.innerHTML = out;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;

    }



    add_but.style.display = "inline-block";

    add_but.onclick = function () {
        form.style.display = "block";
        add_but.style.display = "none";
    }

    var id_field = document.getElementById("fid");
    var firstName_field = document.getElementById("ffirstName");
    var lastName_field = document.getElementById("flastName");
    var phone_field = document.getElementById("fphone");
    var email_field = document.getElementById("femail");

    form.onkeyup = function(event){

         if( id_field.value  && firstName_field.value  &&  lastName_field.value && phone_field.value   && email_field.value){
             sub_form.disabled = false;
         }else{
             sub_form.disabled = true;
         }
    }

    var new_line = {};
    //добавление нового поля в начало таблицы
    sub_form.onclick = function () {
        new_line = {
            id : id_field.value,
            firstName: firstName_field.value,
            lastName: lastName_field.value,
            phone: phone_field.value,
            email:email_field.value
        };

        data1.unshift(new_line);
        firstName_field.value = lastName_field.value = phone_field.value =  id_field.value = email_field.value = "";
        load_table_data(data1);
        form.style.display = "none";
    }

}


