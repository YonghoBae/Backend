
//자바스크립트/노드 언어의 기본특성
//1.자바스크립트/노드는 기본적으로 비동기 프로그래밍 방식으로 작동

//Task1
function fn1(){
    console.log("=========>fn1실행됨");
}

//Task2
function fn2(cbFunction){
    //3초후에 실행되는 fn2()로직
    setTimeout(function(){
        console.log("========>fn2실행됨");
        //fn3();
        cbFunction();
    },3000);
}

//Task3
function fn3(){
    console.log("=========>fn3실행됨");
}



//비동기 방식 예시 : 실행순서와 상관없이 병렬로 실행되는 예시
//전체 처리로직 : fn1(),fn2(),fn3()
//처리 순서와 상관없이 먼저 실행되는 함수부터 실행
// fn1();
// fn2();
// fn3();

//콜백함수를 이용한 동기방식 프로그래밍 적용하기 
//동기방식: fn1() => fn2() =>fn3()
//반드시 fn1로직이 실행된후 fn2가 실행되고 fn3가 실행되게 해보자 콜백함수(함수내에서 함수를 호출하는방식)를 이용해서 
fn1();
//fn2(fn3);
fn2(function(){
    console.log("=========>fn3실행됨");
});