//자바스크립트/노드 프로그래밍은 기본적으로 비동기방식으로 작동

//노드 프로그램이 비동기 방식으로 작동되는 것을 눈으로 확인
//setTimeout()함수는 특정 시간(초) 지난 후에 특정 로직이 실행되는 내장함수
//먼저 끝나는 함수가 먼저 출력 따라서 로직 4->3->2->1로 출력됨 -> 병렬적으로 실행하기 떄문에 
var fnSample = function(){
    
    console.log("fnSample()함수가 실행됩니다...시작!!!!");

    //setTimeout()함수가 실행되면 4초후에 내부로직이 실행
    setTimeout(function(){
        console.log("로직1 실행완료-4초걸려요");
    },4000);

    //setTimeout()함수가 실행되면 3초후에 내부로직이 실행
    setTimeout(function(){
        console.log("로직2 실행완료-3초걸려요");
    },3000);

    //setTimeout()함수가 실행되면 2초후에 내부로직이 실행
    setTimeout(function(){
        console.log("로직3 실행완료-2초걸려요");
    },2000);

    //setTimeout()함수가 실행되면 1초후에 내부로직이 실행
    setTimeout(function(){
        console.log("로직4 실행완료-1초걸려요");
    },1000);
}


//위에 비동기방식으로 작동되는 fnSample()함수로직을 동기방식(순차적 프로그래밍)으로 구현
//순서기반 로직 1->2->3->4 순서대로 함수(타이머내 내용)이 실행되어야하는 업무규칙이 있다고 가정
//동기방식 기반으로 함수구현
//그래서 일반적으로 동기방식을 구현하기 위해 콜백함수를 사용하면 콜백지옥이슈 발생
//콜백지옥을 해결하기 위한 방식으로 자바스크립트에서는 promise/ async/ await라는 키워드를 제공
//가장최신의 비동기방식으로 순차적 프로그래밍 구현할 수 있는 권장되는 방식은 async/await방식을 추천
//(promise는 async/await방식 바로 이전에 사용하던 방식)
var fnSynSample = function(){

    console.log("fnSynSample()함수가 실행됩니다...시작!!!!");

    //setTimeout()함수가 실행되면 4초후에 내부로직이 실행
    setTimeout(function(){
        console.log("로직1 실행완료-4초걸려요");

        setTimeout(function(){
            console.log("로직2 실행완료-3초걸려요");

            setTimeout(function(){
                console.log("로직3 실행완료-2초걸려요");

                setTimeout(function(){
                    console.log("로직4 실행완료-1초걸려요");
                },1000);

            },2000);

        },3000);

    },4000);
}

//비동기방식으로 작동되는 fnSample() 함수를 실행
// fnSample();

//동기방식으로 작동되는 fnSynSample() 함수를 실행
//동기방식으로 순차적 프로그래밍을 하려면 함수로직내에서 다른 함수를 정의/실행하는 방식을 사용(콜백함수)하는데
//콜백함수를 게속사용하면 콜백지옥이 발생. 가독성저해/ 로직이 잘 안보임
fnSynSample();