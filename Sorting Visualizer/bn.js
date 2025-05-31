const arrayContainer = document.getElementById('arrayContainer');
const bubbleSortBtn = document.getElementById('bubbleSortBtn');
const insertionSortBtn = document.getElementById('insertionSortBtn');
const selectionSortBtn = document.getElementById('selectionSortBtn');
const mergeSortBtn = document.getElementById('mergeSortBtn');
const quickSortBtn = document.getElementById('quickSortBtn');
const generateArrayBtn = document.getElementById('generateArrayBtn');
const slowBtn = document.getElementById('slowBtn');
const fastBtn = document.getElementById('fastBtn');
const executionTime = document.getElementById('executionTime');

let array = [];
let delay = 100;

function generateArray() {
    array = [];
    arrayContainer.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray();
    executionTime.innerHTML = '';
}

function displayArray() {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value * 3}px`;
        bar.innerHTML = `<span>${value}</span>`;
        arrayContainer.appendChild(bar);
    });
}

function setSpeed(newDelay) {
    delay = newDelay;
}

async function bubbleSort() {
    const start = performance.now();
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            highlightBars(j, j + 1);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                displayArray();
                await sleep(delay);
            }
            resetBarColor(j, j + 1);
        }
        markSorted(array.length - i - 1);
    }
    const end = performance.now();
    executionTime.innerHTML = `Execution Time: ${(end - start).toFixed(2)} ms`;
}

async function insertionSort() {
    const start = performance.now();
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            highlightBars(j, j + 1);
            array[j + 1] = array[j];
            j = j - 1;
            displayArray();
            await sleep(delay);
            resetBarColor(j + 1);
        }
        array[j + 1] = key;
        displayArray();
        await sleep(delay);
        resetBarColor(i);
    }
    markAllSorted();
    const end = performance.now();
    executionTime.innerHTML = `Execution Time: ${(end - start).toFixed(2)} ms`;
}

async function selectionSort() {
    const start = performance.now();
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            highlightBars(minIdx, j);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
            resetBarColor(j);
        }
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            displayArray();
            await sleep(delay);
        }
        markSorted(i);
    }
    markSorted(array.length - 1);
    const end = performance.now();
    executionTime.innerHTML = `Execution Time: ${(end - start).toFixed(2)} ms`;
}

async function mergeSort() {
    const start = performance.now();
    await mergeSortHelper(array, 0, array.length - 1);
    const end = performance.now();
    executionTime.innerHTML = `Execution Time: ${(end - start).toFixed(2)} ms`;
}

async function mergeSortHelper(arr, left, right) {
    if (left >= right) {
        return;
    }
    const mid = Math.floor((left + right) / 2);
    await mergeSortHelper(arr, left, mid);
    await mergeSortHelper(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);

    for (let i = 0; i < n1; i++) leftArr[i] = arr[left + i];
    for (let i = 0; i < n2; i++) rightArr[i] = arr[mid + 1 + i];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        highlightBars(k);
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
        displayArray();
        await sleep(delay);
        resetBarColor(k - 1);
    }

    while (i < n1) {
        highlightBars(k);
        arr[k] = leftArr[i];
        i++;
        k++;
        displayArray();
        await sleep(delay);
        resetBarColor(k - 1);
    }

    while (j < n2) {
        highlightBars(k);
        arr[k] = rightArr[j];
        j++;
        k++;
        displayArray();
        await sleep(delay);
        resetBarColor(k - 1);
    }
}

async function quickSort() {
    const start = performance.now();
    await quickSortHelper(array, 0, array.length - 1);
    const end = performance.now();
    executionTime.innerHTML = `Execution Time: ${(end - start).toFixed(2)} ms`;
}

async function quickSortHelper(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        highlightBars(j, high);
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            displayArray();
            await sleep(delay);
        }
        resetBarColor(j);
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    displayArray();
    await sleep(delay);
    resetBarColor(i + 1, high);
    return i + 1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightBars(...indices) {
    indices.forEach(index => {
        const bar = arrayContainer.children[index];
        bar.classList.add('scanning');
    });
}

function resetBarColor(...indices) {
    indices.forEach(index => {
        const bar = arrayContainer.children[index];
        bar.classList.remove('scanning');
    });
}

function markSorted(index) {
    const bar = arrayContainer.children[index];
    bar.classList.add('sorted');
}

function markAllSorted() {
    for (let i = 0; i < array.length; i++) {
        markSorted(i);
    }
}

generateArrayBtn.addEventListener('click', generateArray);
bubbleSortBtn.addEventListener('click', bubbleSort);
insertionSortBtn.addEventListener('click', insertionSort);
selectionSortBtn.addEventListener('click', selectionSort);
mergeSortBtn.addEventListener('click', mergeSort);
quickSortBtn.addEventListener('click', quickSort);
slowBtn.addEventListener('click', () => setSpeed(200));
fastBtn.addEventListener('click', () => setSpeed(50));

generateArray();
