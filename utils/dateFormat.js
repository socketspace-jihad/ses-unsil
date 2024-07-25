export function formatDateTimeHumanReadable(date) {
    // Mendefinisikan array nama bulan dan nama hari
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const dayNames = [
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    ];

    // Mendapatkan bagian-bagian tanggal
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const dayIndex = date.getDay();

    // Mendapatkan bagian-bagian waktu
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Menghasilkan string yang diformat
    return `${dayNames[dayIndex]}, ${day} ${monthNames[monthIndex]} ${year} ${hours}:${minutes}:${seconds}`;
}