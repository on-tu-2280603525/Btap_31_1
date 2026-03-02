const API_URL = "https://api.escuelajs.co/api/v1/products";

let allProducts = [];       // dữ liệu gốc
let filteredProducts = [];  // dữ liệu sau search

let currentPage = 1;
let pageSize = 10;
let sortTitleAsc = true;
let sortPriceAsc = true;

/* ===== GET ALL DATA ===== */
async function getAll() {
    const response = await fetch(API_URL);
    allProducts = await response.json();
    filteredProducts = [...allProducts];

    renderTable();
    renderPagination();
}

getAll();

/* ===== RENDER TABLE ===== */
function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredProducts.slice(start, end);

    pageData.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><img src="${p.images[0]}" /></td>

            <td class="title-cell">
                ${p.title}
                <div class="desc">
                    ${p.description}
                </div>
            </td>

            <td>$${p.price}</td>
            <td>${p.category.name}</td>
        `;

        tbody.appendChild(tr);
    });
}

/* ===== SEARCH ===== */
document.getElementById("searchInput").addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();

    filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );

    currentPage = 1;
    renderTable();
    renderPagination();
});

/* ===== PAGE SIZE ===== */
document.getElementById("pageSize").addEventListener("change", e => {
    pageSize = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
    renderPagination();
});

/* ===== PAGINATION ===== */
function renderPagination() {
    const totalPage = Math.ceil(filteredProducts.length / pageSize);
    const div = document.getElementById("pagination");
    div.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = i;
            renderTable();
            renderPagination();
        };

        div.appendChild(btn);
    }
}

/* ===== SORT TITLE ===== */
function sortByTitle() {
    filteredProducts.sort((a, b) => {
        if (a.title < b.title) return sortTitleAsc ? -1 : 1;
        if (a.title > b.title) return sortTitleAsc ? 1 : -1;
        return 0;
    });

    sortTitleAsc = !sortTitleAsc;
    renderTable();
}

/* ===== SORT PRICE ===== */
function sortByPrice() {
    filteredProducts.sort((a, b) =>
        sortPriceAsc ? a.price - b.price : b.price - a.price
    );

    sortPriceAsc = !sortPriceAsc;
    renderTable();
}