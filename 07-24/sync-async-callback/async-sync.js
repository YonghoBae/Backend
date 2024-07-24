//자바스크립트/노드 언어의 기본특성
//자바스크립트/노드는 기본적으로 비동기 프로그래밍 방식으로 작동

function fn1(){
    console.log("========>fn1실행됨");
}

function fn2(){
    //3초후에 실행되는 fn2()로직
    setTimeout(function(){
        console.log("========>fn2실행됨")
    },3000);
}

function fn3(){
    console.log("========>fn3실행됨");
}

//비동기 방식 예시
//전체 처리로직 : fn1()=>fn2()=>fn3()
//처리 순서와 상관없이 먼저 실행되는 함수부터 실행
fn1();
fn2();
fn3();