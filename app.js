// --- DOM Elements ---
const dataTable = document.getElementById('dataTable');
const tableBody = document.getElementById('tableBody');
const noResults = document.getElementById('noResults');
const recordCount = document.getElementById('recordCount');

// Filter Elements
const searchTitleInput = document.getElementById('searchTitle');
const searchAuthorInput = document.getElementById('searchAuthor');
const filterDepartmentInput = document.getElementById('filterDepartment');
const filterPublisherInput = document.getElementById('filterPublisher');
const filterEditionInput = document.getElementById('filterEdition');
const resetFiltersBtn = document.getElementById('resetFilters');

// Pagination Elements
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

// --- State ---
// libraryData is globally injected via data.js loaded in index.html
let filteredRecords = [];
let currentPage = 1;
const recordsPerPage = 50;

// --- Initialization ---

function applyFilters() {
    const titleSearch = searchTitleInput.value.toLowerCase().trim();
    const authorSearch = searchAuthorInput.value.toLowerCase().trim();
    const deptSearch = filterDepartmentInput.value.toLowerCase().trim();
    const pubSearch = filterPublisherInput.value.toLowerCase().trim();
    const edSearch = filterEditionInput.value.toLowerCase().trim();

    // Use global libraryData
    filteredRecords = libraryData.filter(row => {
        if (titleSearch) {
            const rowTitle = String(row['Title'] || '').toLowerCase();
            if (!rowTitle.includes(titleSearch)) return false;
        }

        if (authorSearch) {
            const rowAuthor = String(row['Author'] || '').toLowerCase();
            if (!rowAuthor.includes(authorSearch)) return false;
        }

        if (deptSearch) {
            const rowDept = String(row['Department'] || '').toLowerCase();
            if (!rowDept.includes(deptSearch)) return false;
        }

        if (pubSearch) {
            const rowPublisher = String(row['Publisher'] || '').toLowerCase();
            if (!rowPublisher.includes(pubSearch)) return false;
        }

        if (edSearch) {
            const rowEdition = String(row['Edition'] || '').toLowerCase();
            if (!rowEdition.includes(edSearch)) return false;
        }

        return true;
    });

    recordCount.innerText = filteredRecords.length;
    currentPage = 1;
    renderTable();
}

// Start rendering when page loads
window.addEventListener('DOMContentLoaded', applyFilters);

// --- Event Listeners ---

// Instantly filter as user types
const filterInputs = [
    searchTitleInput, 
    searchAuthorInput, 
    filterDepartmentInput, 
    filterPublisherInput, 
    filterEditionInput
];

filterInputs.forEach(input => {
    input.addEventListener('input', applyFilters);
});

resetFiltersBtn.addEventListener('click', () => {
    searchTitleInput.value = '';
    searchAuthorInput.value = '';
    filterDepartmentInput.value = '';
    filterPublisherInput.value = '';
    filterEditionInput.value = '';
    applyFilters();
});

// Pagination
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// --- Core Functions ---

function renderTable() {
    tableBody.innerHTML = '';
    
    if (filteredRecords.length === 0) {
        dataTable.classList.add('hidden');
        noResults.classList.remove('hidden');
        pagination.classList.add('hidden');
        return;
    }

    dataTable.classList.remove('hidden');
    noResults.classList.add('hidden');
    pagination.classList.remove('hidden');

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    
    // Render dynamic page numbers
    pageNumbers.innerHTML = '';
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Adjust if near ends
    if (currentPage <= 2) endPage = Math.min(totalPages, 5);
    if (currentPage >= totalPages - 1) startPage = Math.max(1, totalPages - 4);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => {
            currentPage = i;
            renderTable();
        };
        pageNumbers.appendChild(btn);
    }
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    const startIdx = (currentPage - 1) * recordsPerPage;
    const endIdx = startIdx + recordsPerPage;
    const currentSlice = filteredRecords.slice(startIdx, endIdx);

    const titleSearch = searchTitleInput.value.trim();
    const authorSearch = searchAuthorInput.value.trim();

    currentSlice.forEach(row => {
        const tr = document.createElement('tr');
        
        const recId = row['RecID'] || '';
        const accNo = row['AccessionNo'] || '';
        const dept = row['Department'] || '';
        let title = row['Title'] || '';
        const edition = row['Edition'] || '';
        let author = row['Author'] || '';
        const publisher = row['Publisher'] || '';
        
        // Map Status codes to human readable if possible
        let status = row['Status'] || '';
        if (status === 'IS') status = '<span style="color: var(--danger); font-weight: 600;">Issued</span>';
        else if (status === 'AV') status = '<span style="color: var(--success); font-weight: 600;">Available</span>';

        // Simple highlight function (case-insensitive) for Title and Author
        if (titleSearch) {
            const regex = new RegExp(`(${titleSearch})`, 'gi');
            title = title.toString().replace(regex, '<span class="highlight">$1</span>');
        }
        if (authorSearch) {
            const regex = new RegExp(`(${authorSearch})`, 'gi');
            author = author.toString().replace(regex, '<span class="highlight">$1</span>');
        }

        tr.innerHTML = `
            <td>${recId}</td>
            <td>${accNo}</td>
            <td>${dept}</td>
            <td style="font-weight: 500;">${title}</td>
            <td>${edition}</td>
            <td>${author}</td>
            <td>${publisher}</td>
            <td>${status}</td>
        `;
        tableBody.appendChild(tr);
    });
}
