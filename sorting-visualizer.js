
let speed = 10;
let wait = 200;
const bars_class = "bars-elements";//css class name of child block created dynamically and should be a part of this class to have a property
const bars_parent = "flex-bar-container"; //css class name of parent element whoese child are div block created dynamically.
let total_bars = 20; //total no. of elements
let margin = 5; //marings betweens elements 
let width = 40;
let default_bgcolor = '#efc738'
let highlight_bgcolor = 'red';
let sort_function;
// if not used this flag than two sorting function can execute simultanously so to keep sorting function synchronnous use this flag
let sort_flag = false;



var dic = {
    'sort-1': selectionSort,
    'sort-2': bubbleSort,
    'sort-3': insertionSort,
    'sort-4': mergeSort,
    'sort-5': quickSort,
    'sort-6': quickSortHoare
};


function rearrange(bars) {
    let parent_node = document.querySelector('.' + bars_parent);
    while (parent_node.firstChild) {
        parent_node.firstChild.remove();
    }
    for (let i = 0; i < bars.length; i++) {
        parent_node.appendChild(bars[i])
    }
}

function select(a) {
    if (!sort_flag) {
        sort_function = dic[a];
    }
}


async function sort() {
    if (!sort_flag && sort_function != undefined) {
        console.log("function called", sort_flag, sort_function)
        sort_flag = true;
        await sort_function();
        console.log("function ended", sort_flag, sort_function)

    }
}

// set speed value/
let time_slider = document.querySelector('.speed-slider');
time_slider.oninput = function () {
    speed = this.value * 4;
    if (this.value < 3) {
        wait = this.value * 50;
    }
    else if (this.value < 7) {
        wait = this.value * 50;
    }
    else {
        wait = 500;
    }

}

let bar_slider = document.querySelector('.bar-slider');
bar_slider.oninput = function () {
    if (this.value <= 2) {
        total_bars = this.value * 10;
    }
    else {
        total_bars = this.value * 5 + 10;
    }
    // increase width of bars on decreasing bars length
    create();
}


// synchronnous function for sleep 
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    })
}

function randomArray(size) {
    let arr = [];
    for (let i = 0; i < total_bars; i++) {
        arr.push(Math.floor((Math.random() * 400) + 20));
    }
    return arr;
}
// creta div block
function create() {
    let parent_node = document.querySelector('.' + bars_parent);
    while (parent_node.firstChild) {
        parent_node.firstChild.remove();
    }
    parent_node.style.width = ((total_bars * width) + (total_bars * margin) + margin) + 'px';
    let random_num = randomArray(total_bars);
    // place element by specifying left posiotion of elements
    let left = 0;
    for (let i = 0; i < total_bars; i++) {

        let tmp_child = document.createElement('div');

        tmp_child.className = bars_class;
        tmp_child.innerHTML = random_num[i];
        tmp_child.style.height = random_num[i] + 'px';
        tmp_child.style.left = left + 'px';
        tmp_child.style.width = width + 'px';

        left += margin + width;
        parent_node.appendChild(tmp_child);
    }
}

function swap(left, right, max_l1, max_l2) {
    let l1 = left.style.left;
    let l2 = right.style.left;


    l1 = l1.slice(0, -2);
    l1 = parseInt(l1);

    l2 = l2.slice(0, -2);
    l2 = parseInt(l2);

    if (l1 != max_l2) {
        left.style.left = (l1 + 1) + 'px';
    }
    if (l2 != max_l1) {
        right.style.left = (l2 - 1) + 'px';
    }
}

function changeColor(left, right, flag) {
    if (flag) {
        left.style.backgroundColor = highlight_bgcolor;
        left.style.border = "3px solid black"
        right.style.border = "3px solid black"
        right.style.backgroundColor = highlight_bgcolor;
    }
    else {
        left.style.backgroundColor = default_bgcolor;
        left.style.border = "2px solid black";
        right.style.border = "2px solid black";
        right.style.backgroundColor = default_bgcolor;
    }
}

async function bubbleSort() {
    console.log("buuble")
    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // .keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }
    // console.log(bars)
    for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            let left = parseInt(bars[j].style.left.slice(0, -2));
            let right = parseInt(bars[j + 1].style.left.slice(0, -2));
            changeColor(bars[j], bars[j + 1], true);
            await sleep(600);
            if (bars[j].clientHeight > bars[j + 1].clientHeight) {
                let l1 = left;
                let r1 = right;

                while (l1 != right && r1 != left) {
                    swap(bars[j], bars[j + 1], left, right);
                    l1 = parseInt(bars[j].style.left.slice(0, -2));
                    l2 = parseInt(bars[j + 1].style.left.slice(0, -2));
                    await sleep(speed);
                }

                let tmp = bars[j];
                bars[j] = bars[j + 1];
                bars[j + 1] = tmp;
            }
            changeColor(bars[j], bars[j + 1], false);
            await sleep(600);

        }
    }
    // rearange child node in div block by removing all and inserting in the sorting sequence
    rearrange(bars);

    console.log("bubble ended");
    // to indicate function has ended now other sorting function can be selected and false will be done at every sorting function coz
    sort_flag = false;

}

async function insertionSort() {
    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // .keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }
    function selectMinElement(elem, flag) {
        if (flag) {
            elem.style.backgroundColor = "rgb(239, 125, 56)";
            elem.style.border = "4px solid black";
        }
        else {
            elem.style.backgroundColor = default_bgcolor;
            elem.style.border = "2px solid black";

        }
    }

    function selectMaxElement(elem, flag) {
        if (flag) {
            elem.style.backgroundColor = highlight_bgcolor;
            elem.style.border = "4px solid black";
        }
        else {
            elem.style.backgroundColor = default_bgcolor;
            elem.style.border = "2px solid black"
        }
    }
    for (let i = 1; i < bars.length; i++) {
        console.log(i);
        j = i - 1;
        num = bars[j + 1];
        selectMinElement(num, true);
        await sleep(wait);
        while (j >= 0 && bars[j].clientHeight > num.clientHeight) {
            // console.log("j= ",bars[j],num.clientHeight,bars[j+1])
            selectMaxElement(bars[j], true);
            await sleep(wait);
            bars[j + 1] = bars[j];
            target = ((width + margin) * (j + 1));
            curr = ((width + margin) * (j));
            while (curr != target) {
                curr += 1;
                bars[j + 1].style.left = curr + 'px';
                await sleep(speed);
            }
            bars[j + 1].style.left = ((width + margin) * (j + 1)) + 'px'
            selectMaxElement(bars[j], false);
            await sleep(wait);
            j--;
        }
        // lft=parseInt(bars[j+1].style.left.slice(0,-2));
        bars[j + 1] = num;
        bars[j + 1].style.left = ((width + margin) * (j + 1)) + 'px';
        selectMinElement(num, false);
        console.log("After ", bars[j + 1], bars);
        await sleep(500);
    }
    console.log(bars);
    rearrange(bars);
    sort_flag = false;
}

async function selectionSort() {
    console.log("selection sort started")
    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // .keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }
    function selectMinElement(bar, flag) {
        if (flag) {
            bar.style.backgroundColor = "rgb(239, 125, 56)";
            bar.style.border = "4px solid black";
        }
        else {

            bar.style.border = "2px solid black";
            bar.style.backgroundColor = default_bgcolor;
        }
    }
    function highlightElement(bar, flag) {
        if (flag) {
            bar.style.backgroundColor = highlight_bgcolor;
            bar.style.border = "4px solid black";
        }
        else {
            bar.style.backgroundColor = default_bgcolor;
            bar.style.border = "2px solid black";
        }

    }
    for (let i = 0; i < bars.length; i++) {
        console.log(i)
        let min = i;
        selectMinElement(bars[min], true);
        await sleep(wait);
        for (let j = i + 1; j < bars.length; j++) {

            highlightElement(bars[j], true);
            await sleep(wait);
            if (bars[min].clientHeight > bars[j].clientHeight) {
                selectMinElement(bars[min], false);
                console.log("swapped ", min, bars[j])
                min = j
                selectMinElement(bars[min], true)
                await sleep(wait);

            }
            highlightElement(bars[j], false);
            if (j == min) {

                selectMinElement(bars[min], true);
            }
            await sleep(wait);
        }
        // swaping bars from left to right
        let left = parseInt(bars[i].style.left.slice(0, -2));
        let right = parseInt(bars[min].style.left.slice(0, -2));
        let l1 = left;
        let r1 = right;
        highlightElement(bars[i], true);
        await sleep(wait);
        while (l1 != right && r1 != left) {
            swap(bars[i], bars[min], left, right);
            l1 = parseInt(bars[i].style.left.slice(0, -2));
            l2 = parseInt(bars[min].style.left.slice(0, -2));
            await sleep((speed / 5));
        }

        // swapping bars elements in bars array
        highlightElement(bars[i], false);
        selectMinElement(bars[min], false);
        // sapping
        let tmp = bars[i];
        bars[i] = bars[min];
        bars[min] = tmp;

        console.log(i, bars[min]);
        // await sleep(10000)
    }
    // rearrange(bars);
    sort_flag = false;
    // console.log("selection sort ended")

}
async function mergeSort() {
    console.log("Merge sort started")
    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }
    console.log(bars);

    function changeColor(element, flag) {
        if (!flag) {
            element.style.backgroundColor = highlight_bgcolor;
            element.style.border = "4px solid black";
        }
        else {
            element.style.backgroundColor = default_bgcolor;
            element.style.border = "2px solid black";

        }
    }

    // move down the lement by changing the position
    async function changeTop(element, flag) {
        if (!flag) {
            curr = 0;
            while (curr < 400) {
                element.style.top = curr + 'px';
                curr += 2;
                await sleep(1);
            }
        }
        else {
            curr = 400;
            console.log("curr in false ", curr);
            while (curr > 0) {
                element.style.top = curr + 'px';
                curr -= 2;
                await sleep(1);
            }
        }
    }

    async function partition(bars, low, high) {
        if (low < high) {
            //whole program change if mid is not defined by "let"
            let mid = low + Math.floor((high - low) / 2)
            // console.log("left ", "low =", low, "mid= ", mid, "high= ", high);
            await partition(bars, low, mid);
            // console.log("right ", "low =", low, "mid= ", mid, "high= ", high);
            await partition(bars, mid + 1, high);
            await merge(bars, low, mid, high);

        }
    }

    async function merge(bars, low, mid, high) {
        let lft = [], rht = [];

        for (let i = low; i < mid + 1; i++) {
            lft.push(bars[i]);
            await changeTop(bars[i], false);
            bars[i].style.backgroundColor = "rgb(19, 170, 156)";
        }
        for (let i = mid + 1; i < high + 1; i++) {
            rht.push(bars[i]);
            await changeTop(bars[i], false);
            bars[i].style.backgroundColor = "rgb(166, 240, 233)";
        }
        let i = 0, j = 0, k = low;
        await sleep(500);
        while (i < lft.length && j < rht.length) {
            changeColor(lft[i], false);
            changeColor(rht[j], false);
            await sleep(500);
            if (lft[i].clientHeight > rht[j].clientHeight) {
                bars[k] = rht[j];
                changeColor(rht[j], true);
                j++;

            }
            else {
                bars[k] = lft[i];
                changeColor(lft[i], true);
                i++;
            }
            bars[k].style.left = ((width + margin) * k) + 'px'
            await changeTop(bars[k], true);

            k++;
        }
        while (i < lft.length) {
            changeColor(lft[i], false);
            await sleep(500);
            bars[k] = lft[i];
            bars[k].style.left = ((width + margin) * k) + 'px'
            await changeTop(bars[k], true);
            // changeColor(lft[i],true);
            // console.log(bars[k].clientHeight)
            changeColor(lft[i], true);
            await sleep(wait);
            i++;
            k++;
        }
        while (j < rht.length) {
            changeColor(rht[j], false);
            await sleep(500);
            bars[k] = rht[j];
            // changeColor(rht[j],false);
            bars[k].style.left = ((width + margin) * k) + 'px'
            await changeTop(bars[k], true);
            changeColor(rht[j], true);
            await sleep(wait);
            // console.log(bars[k].clientHeight)
            // changeColor(rht[j],true);
            j++;
            k++;
        }
        // console.log(low, mid, high);
        // console.log(bars.slice(low, high + 1))
    }
    await partition(bars, 0, bars.length - 1);
    rearrange(bars)
    console.log(bars);
    sort_flag = false;

}

async function quickSort() {
    function changePivot(element,flag){
        if(!flag){
            element.style.border="4px solid black";
            element.style.backgroundColor="rgb(24, 91, 176)";
        }
        else{
            element.style.border="2px solid black";
            element.style.backgroundColor=default_bgcolor;
        }
    }
    async function lumotoPartition(bars, low, high,mid) {
        let pivot = bars[high];
        changePivot(pivot,false);
        await sleep(wait);
        let i = low - 1;
        let j = low;
        while (j < high) {
            if (bars[j].clientHeight < pivot.clientHeight) {
                i++;
                let lft=(width+margin)*i;
                let rht=(width+margin)*j;

                let l=lft,r=rht;
                while(l<=rht || r>=lft){
                    if(l<=rht){
                        l++;
                        bars[i].style.left = l + 'px';
                    }
                    if(r>=lft){
                        r--;
                        bars[j].style.left = r + 'px';
                    }
                    await sleep(10);
                }

                let tmp = bars[j];
                bars[j] = bars[i];
                bars[i] = tmp;

            }
            j++;
        }
        let tmp = bars[i + 1]
        bars[i + 1] = pivot;
        bars[high] = tmp;
        bars[high].style.left = ((width + margin) * high) + 'px';
        bars[i + 1].style.left = ((width + margin) * (i + 1)) + 'px';
        console.log("changed")
        await sleep(2000);
        changePivot(pivot,true);
        return i + 1;
    }

    async function qsort(bars, low, high) {
        if (low < high) {
            let mid=await lumotoPartition(bars, low, high);
            console.log(bars, mid);
            await qsort(bars, low, mid - 1);
            await qsort(bars, mid + 1, high);
        }
    }

    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }


    console.log(bars, " Started ");
    await qsort(bars, 0, bars.length - 1);
    
    console.log("ended")
    rearrange(bars);
    sort_flag = false;
}
async function heapSort() {
    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }
    console.log("heap sort started");

    function heapify(arr, i, sz) {
        let lft = 2 * i + 1;
        let rht = 2 * i + 2;

        let smallest = i;

        if (lft < sz && arr[lft].clientHeight > arr[smallest].clientHeight) {
            smallest = lft;
        }
        if (rht < sz && arr[rht].clientHeight > arr[smallest].clientHeight) {
            smallest = rht;
        }
        if (smallest != i) {
            let tmp = arr[i];
            arr[i] = arr[smallest];
            // arr[smallest=tmp];
            arr[smallest] = tmp;


            heapify(arr, smallest, sz);

        }

    }

    function extractMax(arr, sz) {
        let tmp = arr[0];
        arr[0] = arr[sz];
        arr[sz] = tmp;

        heapify(arr, 0, sz - 1);

    }

    function hsort(arr) {

        // build heap
        let sz = arr.length - 1;
        for (let i = ((sz - 1) / 2); i > -1; i--) {
            heapify(arr, i, sz);
        }

        for (let i = sz; i > -1; i--) {
            extractMax(arr, i);
        }
    }

    hsort(bars);
    console.log("Ended");
    console.log(bars);
    sort_flag = false;

}

async function quickSortHoare() {
    let childs = document.querySelectorAll("." + bars_class);
    let bars = [];
    // keys return Array iterator keys coz childs in an object of array and along with ref of div v=bloc kit contains lots of other things also
    for (let i of childs.keys()) {
        bars.push(childs[i]);
    }
    console.log("heap sort started");

    function pivotColor(elem,flag){
        if(!flag){
            elem.style.backgroundColor="rgb(24, 91, 176)";
            elem.style.border="4px solid black";
        }
        else{
            elem.style.border="2px solid black";
            elem.style.backgroundColor=default_bgcolor;
        }
    }
    async function hoarePartition(arr, l, h) {
        let pivot = l;
        let i = l;
        let j = h;
        pivotColor(arr[pivot],false);
        while (true) {
            while (i < h && arr[i].clientHeight < arr[pivot].clientHeight) {
                i++;
            }
            while (j > l && arr[j].clientHeight > arr[pivot].clientHeight) {
                j--;
            }
            if (i >= j) {
                return j;
            }
            
            let right=(width+margin)*j,left=(width+margin)*i;
            let lef=left,rig=right;
            while(lef<=right || rig>=left){
                if(lef<=right){
                    lef++;
                    arr[i].style.left=lef+'px';
                }
                if(rig>=left){
                    rig--;
                    arr[j].style.left=rig+'px'
                }
                await sleep(10);
            }
            let tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    async function qSort(arr,l,h){
        if(l<h){
            let mid = await hoarePartition(arr,l,h);
            qSort(arr,l,mid);
            qSort(arr,mid+1,h);
        }
    }

    await qSort(bars,0,bars.length-1);
    console.log(bars);
    console.log("Ended")

    sort_flag = false;
}

