// Ambil elemen-elemen dari HTML
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieContainer = document.getElementById('movieContainer');
const messageArea = document.getElementById('messageArea');

// Event listener ketika tombol "Cari Film" diklik
searchBtn.addEventListener('click', function() {
    const keyword = searchInput.value.trim();
    if (keyword !== "") {
        fetchMovies(keyword);
    } else {
        messageArea.innerHTML = `<p class="text-warning">Ketik dulu judul filmnya, sepuh!</p>`;
    }
});

// Event listener tambahan: kalau user tekan tombol "Enter" di keyboard
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Fungsi utama melakukan Fetch API ke OMDb
async function fetchMovies(query) {
    // Tampilkan teks loading
    messageArea.innerHTML = `<div class="spinner-border text-danger" role="status"></div> <p class="mt-2">Sedang mencari film...</p>`;
    movieContainer.innerHTML = ""; // Bersihkan layar dari hasil sebelumnya

    // API Key Publik OMDb (aman untuk latihan)
    const apiKey = "trilogy"; // atau pakai key publik umum
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Cek apakah filmnya ditemukan oleh API
        if (data.Response === "True") {
            messageArea.innerHTML = ""; // Hapus pesan loading
            displayMovies(data.Search); // Panggil fungsi cetak kartu
        } else {
            messageArea.innerHTML = `<p class="text-danger">Waduh, film "${query}" tidak ditemukan, sepuh!</p>`;
        }

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        messageArea.innerHTML = `<p class="text-danger">Gagal mengambil data. Cek koneksi internetmu!</p>`;
    }
}

// Fungsi untuk mencetak Array of Objects film ke layar (Looping DOM)
function displayMovies(movies) {
    let cardsHTML = "";

    // Looping menggunakan forEach untuk setiap film yang didapat
    movies.forEach(movie => {
        // Cek apakah poster tersedia atau N/A
        const posterImage = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";
        console.log(posterImage);
        cardsHTML += `
            <div class="col-md-3 mb-4">
                <div class="card bg-secondary text-light h-100 shadow-sm border-0">
                    <img src="${posterImage}" class="card-img-top" alt="${movie.Title}" style="height: 350px; object-fit: cover;">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title fs-6 fw-bold">${movie.Title}</h5>
                            <p class="card-text text-warning small">${movie.Year}</p>
                        </div>
                        <span class="badge bg-dark align-self-start">${movie.Type}</span>
                    </div>
                </div>
            </div>
        `;
    });

    // Masukkan semua kartu yang sudah jadi ke dalam wadah movieContainer
    movieContainer.innerHTML = cardsHTML;
}