
omsMain.commentForm = {
    selector: '#commentForm',
    jq: undefined,

    config: {
        userSeq: '',				// 사용자 세션 (아이디)
        userNm: '',				// 사용자 세션 (이름)
        storeCd: 'jti01',			// 상점코드
        commentMode: 'I',			// INSERT or UPDATE
        adminYn: 'N',				// 사용자가 관리자인지 체크
        commentSeq: '',				// 수정시 커멘트 번호
        imagePath: '',				// 수정시 기존 이미지 경로
        wuserSeq: ''				// 작성자 seq저장
    },

    show: function (config) {
        omsMain.commentForm.loadComment(config);
    },

    uptShow: function (config) {
        omsMain.commentForm.loadUpdateComment(config);
    },

    hide: function () {
        $('.comment_contents').val('');
        $('.textCount').text('0');
        $('.myDataFile').val('');

        omsMain.commentForm.jq.hide();
    },

};

omsMain.commentForm.loadComment = function (config) {
    // 커멘트 입력창 로딩.
    omsMain.commentForm.config.storeCd = config.storeCd;
    $('#comment_title').text('커멘트 추가하기');
    $('.commentWriteButton').css('display', '');
    $('.commentUpdateButton').css('display', 'none');
    $('.pop_contents').css('padding-bottom', '30px');
    $('.comment.imageArea').css('display', 'none');
    omsMain.commentForm.config.commentMode = "I";

    //  max commentSeq값 가져오기
    $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
        data: {
            sqlId: 'jti.selectJtiCommentMaxSeq',
            sqlMode: 'SELECT_ONE',
            storeCd: omsMain.commentForm.config.storeCd
        },
        success: function (result, status) {
            omsMain.commentForm.config.commentSeq = result.commentSeq;
        },
        error: function (result, status, error) {
            //console.log(status);
            //console.log(error);
        },
        method: 'post'
    });


    this.jq.show();
};

omsMain.commentForm.loadUpdateComment = function (config) {
    // ajax로 커멘드 수정창 로딩.
    this.jq.show();
    // 	//console.log("===========================");
    // 	//console.log(config);
    $('#comment_title').text('커멘트 수정하기');
    $('.commentWriteButton').css('display', 'none');
    $('.commentUpdateButton').css('display', '');
    $('.pop_contents').css('padding-bottom', '30px');
    omsMain.commentForm.config.commentMode = "U";
    omsMain.commentForm.config.storeCd = config.storeCd;

    $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
        data: {
            sqlId: 'jti.selectJtiCommentOne',
            sqlMode: 'SELECT_ONE',
            storeCd: config.storeCd,
            commentSeq: config.commentSeq
        },
        success: function (result, status) {
            if (result.result < 0) {
                if (result.result == -10)
                    alert('오류');
            } else {
                $('.comment_contents').val(result.commentContents);
                omsMain.commentForm.jq.find('[name="userSeq"]').val(result.userSeq);
                omsMain.commentForm.jq.find('[name="storeCd"]').val(result.storeCd);
                omsMain.commentForm.jq.find('[name="commentSeq"]').val(result.commentSeq);
                // 				omsMain.commentForm.jq.find('.comment.imageArea').html("<image src='"+result.imagePath+"' sylte='border:1px solid #333333;'>");
                if (result.imagePath !== undefined && result.imagePath != '') {
                    // 					//console.log(result.imagePath);
                    // 					//console.log(result);
                    $('.comment.imageArea').css('display', '');
                    omsMain.commentForm.jq.find('.comment.imageArea').html("<image src='" + result.imagePath + "' style='width:100px; height:80px;border:1px solid #333333;'>");
                    omsMain.commentForm.config.imagePath = result.imagePath;
                }

                $('.textCount').text(result.commentContents.length);
            }
        },
        error: function (result, status, error) {
            //console.log(status);
            //console.log(error);
            alert('에러');
        },
        method: 'post'
    });
};

omsMain.commentForm.makeCommentHtml = function (mode, image_path) {
    var commentHtml = "";
    $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
        data: {
            sqlId: 'jti.selectJtiCommentList',
            storeCd: omsMain.commentForm.config.storeCd
        },
        success: function (result, status) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    commentHtml += '<li class="' + result[i].commentSeq + '" >';
                    commentHtml += '<div class="group_top">';
                    commentHtml += '<span class="tit">' + result[i].usernm + '</span>';
                    commentHtml += '<span class="date">' + result[i].regDate + '</span>';
                    commentHtml += '</div>';
                    commentHtml += '<div class="group_con ' + result[i].storeCd + '_' + result[i].commentSeq + '">';
                    if (result[i].imagePath !== undefined) {
                        //						commentList += '<span class="thm"><img src="http://nv1.tveta.naver.net/libs/1147/1147719/20161123190654-E9dLzkRy.jpg" style="width;50px; height:30px;"  alt="" /></span>';
                        commentHtml += '<span class="thm imageDetail"><img src="' + result[i].imagePath + '" alt="" style="width:50px; height:30px;"/></span>';
                    }
                    commentHtml += '<span class="tit" comment-seq="' + result[i].commentSeq + '" comment-store="' + result[i].storeCd + '">' + result[i].commentContents + '</span>';
                    commentHtml += '</div>';
                    commentHtml += '<ul class="group_btn">';
                    commentHtml += '<li><a href="#none" class="commentDetail" comment-seq="' + result[i].commentSeq + '" comment-store="' + result[i].storeCd + '" user-seq="' + result[i].userSeq + '">수정</a></li>';
                    commentHtml += '<li><a href="#none" class="comment_list_del" comment-seq="' + result[i].commentSeq + '" comment-store="' + result[i].storeCd + '" user-seq="' + result[i].userSeq + '">삭제</a></li>';
                    commentHtml += '</ul>';
                    commentHtml += '</li>';
                }
            } else {
                commentHtml += '<li class="firstComment">';
                commentHtml += '커멘트를 입력해주세요.';
                commentHtml += '</li>';
            }
            $('.list_comment').html(commentHtml);
        },
        error: function (result, status, error) {
            //			alert('에러');
            // comment list 값이 없을때 코딩 추가
            commentHtml += '<li class="firstComment">';
            commentHtml += '커멘트를 입력해주세요.';
            commentHtml += '</li>';
            $('.list_comment').html(commentHtml);
        },
        method: 'POST'
    });

}

omsMain.commentForm.init = function (option) {
    this.jq = $(this.selector);
    this.jq.css('left', Math.max(0, (($(window).width() - this.jq.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    this.jq.hide();

    // 세션에서 userSeq, userN가져오기
    omsMain.commentForm.config.userSeq = "79";
    omsMain.commentForm.config.userNm = "openmate";
    omsMain.commentForm.config.adminYn = "Y";

    var image_path;
    var sqlId, sqlMode;

    //확인버튼 클릭시 comment 등록
    $('#commnetFmw').attr('action', jtiConfig['mapserverUrl'] + '/data/upload.json?upload.path=/data/jti').ajaxForm({
        beforeSubmit: function (data, frm, opt) {
            var commentMode = omsMain.commentForm.config.commentMode;
            if (omsMain.commentForm.jq.find('[name="commentContents"]').val() === undefined || omsMain.commentForm.jq.find('[name="commentContents"]').val() == '') {
                alert("커멘트 내용을 입력해주세요.");
                return false;
            }

            // 커멘트 내용이 있는지 확인(글자수 체크 )
            var contents = omsMain.commentForm.jq.find('[name="commentContents"]').val();
            var wUserSeq = omsMain.commentForm.jq.find('[name="userSeq"]').val();

            if (contents === undefined || contents == '') {
                alert("커멘트 내용을 입력해주세요.");
                return false;
            } else if (contents.length > 300) {
                alert("커멘트 글자수가 300자를 초가 하였습니다.");
                return false;
            }

            if (commentMode == "I") {
                sqlId = 'jti.insertJtiComment';
                sqlMode = 'INSERT';
            } else {
                sqlId = 'jti.updateJtiComment';
                sqlMode = 'UPDATE';

                //글쓴이가 동일하거나 관리자만 수정가능
                if (omsMain.commentForm.config.adminYn != "Y" && (wUserSeq !== undefined && wUserSeq !== omsMain.commentForm.config.userSeq)) {
                    alert("작성자만 수정할 수 있습니다.");
                    return false;
                }
            }

            return true;

        },
        uploadProgress: function (event, position, total, percentComplete) {
            omsMain.loading.showLoading();
        },
        //submit이후의 처리
        success: function (res, status) {
            omsMain.loading.closeLoading();
            if (res.fileList.length == 0) {
                image_path = "";
            } else {
                // 이미지 확장자 확인 및 용량체크하기
                if (("jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG").indexOf(res.fileList[0].extension) === -1) {
                    alert("jpg, png, gif, jpeg 파일만 업로드 가능합니다.");
                    return;
                }
                // 용량체크를 하게 될 경우, res.fileList[0].fileSize 로 체크

                // imagePath 값 입력
                image_path = jtiConfig['mapserverUrl'].substr(0, jtiConfig['mapserverUrl'].lastIndexOf("/")) + "/data/jti/" + res.fileList[0].storFileNm;
                // 				//console.log(image_path);
            }
            var commentSeq_temp = omsMain.commentForm.jq.find('[name="commentSeq"]').val() || '0';

            omsMain.commentForm.config.userSeq = "79";

            $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
                data: {
                    sqlId: sqlId,
                    sqlMode: sqlMode,
                    storeCd: omsMain.commentForm.config.storeCd,
                    commentSeq: commentSeq_temp,
                    commentContents: omsMain.commentForm.jq.find('[name="commentContents"]').val(),
                    imagePath: image_path,
                    userSeq: omsMain.commentForm.config.userSeq
                },
                success: function (result, status) {
                    //등록된 글까지 나오게 리스트를 다시 불러오기
                    omsMain.commentForm.makeCommentHtml(sqlMode, image_path);

                    omsMain.commentForm.hide();
                },
                error: function (result, status, error) {
                    //console.log(status);
                    //console.log(error);
                    alert('에러');
                },
                method: 'POST'
            });

        },

        //ajax error
        error: function () {
            alert("에러발생!!");
            //   			$(".imagePath").val();
        }
    });


    this.jq.find('.ok_comment').on('click', function () {
        $('#commnetFmw').submit();
    });

    //팝업닫기
    this.jq.find('.cancel_comment').on('click', function () {
        omsMain.commentForm.hide();
    });

    //입력한 글자수 
    this.jq.find('.comment_contents').on('keydown', function () {
        var content = $(this).val();
        $('.textCount').text(content.length);
        if (content.length > 300) {
            $('.textCount').css('color', 'red');
        } else {
            $('.textCount').css('color', '');
        }
    });



    //  ( 임시 ) 수정 화면 이동 
    // 	this.jq.find('#comment_title').on('click', function(){
    // 		//   ( 임시 )
    // 		var config = {
    // 			storeCd:'jti01',
    // 			commentSeq:'2',
    // 			commentMode : 'U'
    // 		};
    // 		omsMain.commentForm.uptShow(config);
    // 	});

    // 커멘트 수정
    this.jq.find(".upt_comment").on('click', function () {
        $('#commnetFmw').submit();
    });

    // 커멘트 삭제
    this.jq.find(".del_comment").on('click', function () {

        var param = {
            wUserSeq: omsMain.commentForm.jq.find('[name="userSeq"]').val(),
            storeCd: omsMain.commentForm.jq.find('[name="storeCd"]').val(),
            commentSeq: omsMain.commentForm.jq.find('[name="commentSeq"]').val()
        };
        $('body').trigger("bind_commentDelete_start", [true, param]);

    });

    $('body').bind("bind_commentDelete_start", function (event, show, params) {

        //  세션에 있는 user_id/ adminYn 값 가져오기. 
        var userSeq = omsMain.commentForm.config.userSeq;
        var adminYn = omsMain.commentForm.config.adminYn

        // 글쓴이가 동일하거나 관리자만 삭제가능
        if (!(params.wUserSeq !== undefined && (adminYn == 'Y' || params.wUserSeq == userSeq))) {
            alert("작성자만 삭제할 수 있습니다.");
            return false;
        }

        if (confirm("삭제하시겠습니까?")) {

            $.ajax(jtiConfig['mapserverUrl'] + '/data/mapper.json', {
                data: {
                    sqlId: 'jti.deleteJtiComment',
                    sqlMode: 'DELETE',
                    storeCd: params.storeCd,
                    commentSeq: params.commentSeq
                },
                success: function (result, status) {
                    if (result.result < 0) {
                        if (result.result == -10)
                            alert('오류');
                    } else {
                        //커멘트 리스트 reload
                        $('.' + params.commentSeq).remove();

                        omsMain.commentForm.hide();
                    }
                },
                error: function (result, status, error) {
                    //console.log(status);
                    //console.log(error);
                    alert('에러');
                },
                method: 'POST'
            });
        }

    });
};

omsMain.commentForm.init();