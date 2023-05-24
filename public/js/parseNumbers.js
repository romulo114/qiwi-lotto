function parseNumbers(lotteryname) {
    var parsedQs;
    //debugger;
    if(qs["lang"] && qs["lotterytypeid"] && qs["bta"] && qs["prc"] && qs["sn"]) {
        parsedQs = {
            lang: qs["lang"],
            lotterytypeid: qs["lotterytypeid"],
            bta: qs["bta"],
            prc: qs["prc"],
            sn: qs["sn"],
            lines: qs["sn"].split('|')
        }
    }

    if(typeof parsedQs !== "undefined"){
        var currentLottoId = $("#lotteryId").val();

        //homepage redirect if lotteryid doesn't match lottery-link
        if(parsedQs.lotterytypeid !== currentLottoId ){
            window.location = CONFIG.homeURL;
        }

        setSelectedNumbers(parsedQs.lines)

    } else if(typeof qs["group-tab"] !== "undefined"){
        setActiveTab("group");
    } else if(sessionStorage.getItem(lotteryname.toLowerCase())){
        //todo for null check, skip
        //debugger;
        var _data = sessionStorage.getItem(lotteryname.toLowerCase());
        var parsedData = JSON.parse(_data);
        //console.log(parsedData)

        var ticketType = parsedData['ticketType'];
        var linesNo = parsedData['lines'];
        if (linesNo == 10) {
            jQuery('.addline-single').css('display', 'none');
            jQuery('.addline-more').css('display', 'none');
        }
        if(parsedData.storeselected !== "") {
            setActiveTab(ticketType);
        }

        //split and get numbers and display if ticket is single
        if(ticketType === 'single'){
            jQuery(".select_num_col_part").find(".lt_numbers_wrapper").children("span").removeAttr('class');
            jQuery(".select_num_col_part").find(".select_num_part_wrapper").children("span").removeClass('extra_active');
            //debugger;
            if (linesNo > 5) {
                if (isMobile) {
                    for (var y = 5; y < linesNo; y++) {
                        addEmptyLineMobile()
                    }
                } else {
                    jQuery(".addlines").click();
                }
            } else if(linesNo < 5 && isMobile) {
                //debugger;
                for (var z = 5; z > linesNo; z--) {
                    //jQuery(".select_num_col:nth-of-type("+z+")").find(".quickpic_delete").trigger("click");
                    jQuery(".select_num_col:nth-of-type("+z+")").find(".quickpic_text").trigger("click");
                }
            }

            var linesSplited = parsedData['selno'].split('|');

            //removing empty elements in array
            for (var i = 0; i < linesSplited.length; i++) {
                if (linesSplited[i] == "") {
                    linesSplited.splice(i, 1);
                    i--;
                }
            }
            setSelectedNumbers(linesSplited)
            setValuesToForm(parsedData, ticketType);
            totalForSingle();
        } else {
            setValuesToForm(parsedData, ticketType);
            totalForGroup(parsedData['quantity']);
        }
    } else if(isMobile) {
        //debugger;
        //initial values for mobile
        jQuery('#lines').val(5);
        jQuery("#totallines").val(1);
        linesNum = jQuery('#lines').val();
        //if (NYlotto)
        var lottery = jQuery("#otherdata").val().split("|");
        if (lottery[1] == 'NewYorkLotto') {
            setTimeout(function(){
                //debugger;
                var numberofSelected = jQuery(".select_num_col").length - 1;
                var temp = numberofSelected % 2;
                if (temp > 0) {
                    jQuery(".select_num_col:nth-of-type(5)").find(".quickpic_delete").trigger("click");
                }
            }, 400);
        }
        $(".picall_btn").click();
    } else {
        //$(".picall_btn").click();
        totalForSingle();
    }

    function setSelectedNumbers(lines){
        //debugger;
        lines.forEach(function(value, index){
            var _line = index,
                numbers = [],
                specialNumbers= [];

            var mainDiv = jQuery(".select_num_col")[_line];
            $(mainDiv).addClass("selected");

            //check for special numebers
            if(lines[index].indexOf("#")!== -1) {
                var allNumebrsPerLine = lines[index].split('#');
                var _index = parseInt(lines[index].indexOf("#")) + 1;

                numbers = allNumebrsPerLine[0];

                if(lines[index].substring(_index) !== ""){
                    specialNumbers = allNumebrsPerLine[1].split(',');
                }
            }
            numbers = numbers.split(',');

            var divPerLine = jQuery(".select_num_col_part .lt_numbers_wrapper")[_line];

            numbers.forEach(function(value, index){
                if(value.indexOf("#")!== -1){
                    value = value.substring(0, value.indexOf("#"));
                }
                $(divPerLine).children("#" + value).addClass("main_active");
            });

            //display extra ball
            if(specialNumbers.length > 0){
                var divPerLineSpecial = jQuery(".select_num_col_part .select_num_part_wrapper")[_line];
                specialNumbers.forEach(function (value, index){
                    $(divPerLineSpecial).children("#" + value).addClass("extra_active");
                });
            }
        });
    }

    function setValuesToForm(parsedData, ticketType){
        //debugger;
        for (var key in parsedData) {
            var name = key;
            var val = parsedData[key];

            var $el = $('#' + name),
                type = $el.attr('type');

            if(ticketType === 'single' && name === 'radio2'){
                //select name single_totaldraw
                $select = $('.single_totaldraw');
            }else if(ticketType === 'single' && name === 'radio3'){
                //select name single_subs
                $select = $('.single_subs');
            }
            else if(ticketType === 'group' && name === 'grpradio2'){
                //select name single_subs
                $select = $('.group_totaldraw');
            }
            else if(ticketType === 'group' && name === 'grpradio3'){
                //select name single_subs
                $select = $('.group_subs');
            }
            else if(ticketType === 'group' && name === 'quantity'){
                //select name single_subs
                $el = $("#group").find('input[name=quantity]');
            }

            switch(type){
                case 'radio':
                    $el.prop("checked", true);
                    if(typeof $select !== 'undefined' && $select.length > 0){
                        $select.val(val);
                    }
                    break;
                case 'hidden':
                    if ($el.selector === "#lines" && isMobile && val < 5) {
                        //$("#lines").val(5);
                        $el.val(5);
                    } else {
                        $el.val(val);
                    }
                    break;
                default:
                    $el.val(val);
            }
        }
    }
};
