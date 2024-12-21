const karyawanList = [
  { nama: "Situr", gajiPerHari: 100.000, lemburRate: 50.000, absensi: [], tidakHadir: [], klikHariIni: 0 },
  { nama: "Aang Jeen", gajiPerHari: 170.000, lemburRate: 100.000, absensi: [], tidakHadir: [], klikHariIni: 0 },
  { nama: "Kotar", gajiPerHari: 150.000, lemburRate: 100.000, absensi: [], tidakHadir: [], klikHariIni: 0 },
  { nama: "Mas I", gajiPerHari: 170.000, lemburRate: 100.000, absensi: [], tidakHadir: [], klikHariIni: 0 },
  { nama: "Mas Gi", gajiPerHari: 170.000, lemburRate: 100.000, absensi: [], tidakHadir: [], klikHariIni: 0 },
];

const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const absensiTable = document.getElementById("absensi-table");
const penghasilanContainer = document.getElementById("penghasilan-container");

// Fungsi menghitung pendapatan reguler dan lembur
function hitungPendapatan(karyawan) {
  let pendapatanReguler = 0;
  let pendapatanLembur = 0;

  karyawan.absensi.forEach((status) => {
    if (status === "Hadir") pendapatanReguler += karyawan.gajiPerHari;
    if (status === "Lembur") {
      pendapatanReguler += karyawan.gajiPerHari;
      pendapatanLembur += karyawan.lemburRate;
    }
  });

  return { pendapatanReguler, pendapatanLembur };
}

// Fungsi memperbarui tabel absensi
function updateAbsensiTable(hariIndex) {
  let tableContent = `
    <thead>
      <tr>
        <th>Nama Karyawan</th>
        <th>${hariList[hariIndex]}</th>
        <th>Cek Tidak Hadir</th>
      </tr>
    </thead>
    <tbody>
  `;

  karyawanList.forEach((karyawan, karyawanIndex) => {
    const status = karyawan.absensi[hariIndex] || "Tidak Hadir";
    const isDisabled = karyawan.klikHariIni >= 2 ? "disabled" : "";

    tableContent += `<tr>
      <td>${karyawan.nama}</td>
      <td>
        ${status}
        <div>
          <button ${isDisabled} onclick="setStatus(${karyawanIndex}, ${hariIndex}, 'Hadir')">Hadir</button>
          <button ${isDisabled} onclick="setStatus(${karyawanIndex}, ${hariIndex}, 'Lembur')">Lembur</button>
          <button ${isDisabled} onclick="setStatus(${karyawanIndex}, ${hariIndex}, 'Tidak Hadir')">Tidak Hadir</button>
        </div>
      </td>
      <td>
        <input type="checkbox" onchange="cekTidakHadir(${karyawanIndex}, ${hariIndex}, this.checked)" ${status === "Tidak Hadir" ? "checked" : ""}>
      </td>
    </tr>`;
  });

  tableContent += `</tbody>`;
  absensiTable.innerHTML = tableContent;
}

// Fungsi memperbarui data penghasilan
function updatePenghasilan() {
  penghasilanContainer.innerHTML = "";

  karyawanList.forEach((karyawan) => {
    const { pendapatanReguler, pendapatanLembur } = hitungPendapatan(karyawan);
    const totalPendapatan = pendapatanReguler + pendapatanLembur;

    const penghasilanDiv = document.createElement("div");
    penghasilanDiv.classList.add("penghasilan");
    penghasilanDiv.innerHTML = `
      <h3>${karyawan.nama}</h3>
      <p>Pendapatan Reguler: ${pendapatanReguler}</p>
      <p>Pendapatan Lembur: ${pendapatanLembur}</p>
      <p><strong>Total Pendapatan: ${totalPendapatan}</strong></p>
      <p>Tidak Hadir Pada: ${karyawan.tidakHadir.join(", ") || "Tidak Ada"}</p>
    `;

    penghasilanContainer.appendChild(penghasilanDiv);
  });
}

// Fungsi untuk mengatur status kehadiran
function setStatus(karyawanIndex, hariIndex, status) {
  const karyawan = karyawanList[karyawanIndex];

  if (karyawan.klikHariIni >= 2) {
    alert("Anda hanya bisa melakukan 2 kali klik per hari.");
    return;
  }

  karyawan.absensi[hariIndex] = status;
  karyawan.klikHariIni++;

  if (status === "Tidak Hadir") {
    const tanggalHariIni = new Date().toLocaleDateString();
    if (!karyawan.tidakHadir.includes(tanggalHariIni)) {
      karyawan.tidakHadir.push(tanggalHariIni);
    }
  }

  updateAbsensiTable(hariIndex);
  updatePenghasilan();
}

// Fungsi untuk memeriksa tidak hadir
function cekTidakHadir(karyawanIndex, hariIndex, isChecked) {
  if (isChecked) {
    setStatus(karyawanIndex, hariIndex, "Tidak Hadir");
  } else {
    karyawanList[karyawanIndex].tidakHadir = karyawanList[karyawanIndex].tidakHadir.filter(
      (tanggal) => tanggal !== new Date().toLocaleDateString()
    );
    setStatus(karyawanIndex, hariIndex, "");
  }
}

// Mendapatkan hari ini berdasarkan hari nasional
const hariIniIndex = new Date().getDay() - 1; // 0 = Minggu, 1 = Senin, ...
const hariIndex = hariIniIndex >= 0 ? hariIniIndex : 6;

// Inisialisasi absensi kosong untuk semua karyawan
karyawanList.forEach((karyawan) => {
  karyawan.absensi = new Array(hariList.length).fill("Tidak Hadir");
});

// Inisialisasi tampilan
updateAbsensiTable(hariIndex);
updatePenghasilan();
