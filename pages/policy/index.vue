<template>
  <ProfileLayout>
  <div class="policy-layout">
    <!-- Sidebar -->
    <aside class="policy-sidebar">
      <div class="policy-sidebar__section">
        <div class="policy-sidebar__title">Bảo hành</div>
        <button
          v-for="item in sidebarItems"
          :key="item.key"
          type="button"
          class="policy-sidebar__item"
          :class="{ 'policy-sidebar__item--active': activeSection === item.key }"
          @click="activeSection = item.key"
        >
          {{ item.label }}
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="policy-content">

      <!-- I. Đổi mới 30 ngày -->
      <section v-if="activeSection === 'return'" class="policy-section">
        <h1 class="policy-section__title">I. Đổi mới 30 ngày miễn phí</h1>
        <p class="policy-section__desc">Áp dụng khi máy có lỗi phần cứng từ phía nhà sản xuất.</p>

        <div class="policy-table-wrap">
          <table class="policy-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đổi mới miễn phí</th>
                <th>Quy định nhập lại, trả lại (thu cũ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Điện thoại, Máy tính bảng, Macbook, Apple Watch</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày đầu: trừ phí <strong>20%</strong> trên giá hiện tại.<br> Sau 30 ngày: Nhập lại theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Samsung Watch</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày đầu: trừ phí <strong>30%</strong> trên giá hiện tại.<br> Sau 30 ngày: Nhập lại theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Laptop</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày đầu: trừ phí <strong>20%</strong> trên giá hiện tại.<br> Sau 30 ngày: Nhập lại theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Màn hình máy tính</td>
                <td>15 ngày</td>
                <td>Trong 15 ngày đầu: trừ phí <strong>20%</strong> trên giá hiện tại.<br> Sau 15 ngày: Nhập lại theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Loa - Tai nghe cao cấp</td>
                <td>15 ngày</td>
                <td>Trong 30 ngày đầu: trừ phí <strong>40%</strong> trên giá mua ban đầu.<br> Từ 31–60 ngày: trừ phí <strong>50%</strong> trên giá mua ban đầu.</td>
              </tr>
              <tr>
                <td>Hàng cũ</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày đầu: trừ phí <strong>15%</strong> trên giá hiện tại.<br> Sau 30 ngày: Nhập lại theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Tivi / Đồ gia dụng</td>
                <td>30 ngày / 15 ngày</td>
                <td>Không áp dụng nhập lại.</td>
              </tr>
              <tr>
                <td>Phụ kiện &gt; 1 triệu</td>
                <td>15 ngày</td>
                <td>Không áp dụng nhập lại. <em>(Riêng Airpods: trừ phí 20% trong 30 ngày đầu.)</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="policy-section__subtitle">Điều kiện đổi trả</h3>
        <ul class="policy-list">
          <li><strong>Máy mới:</strong> Như mới, không trầy xước, không dán decal, hình trang trí.</li>
          <li><strong>Máy cũ:</strong> Có tình trạng sản phẩm như lúc mới mua.</li>
          <li><strong>Hộp:</strong> Như mới, không móp méo, rách, viết vẽ, quấn băng dính... Số Serial/IMEI trên hộp phải trùng với thân máy.</li>
          <li><strong>Phụ kiện và quà tặng:</strong> Còn đầy đủ, nguyên vẹn, không móp méo hoặc hư hại trong quá trình sử dụng.</li>
          <li><strong>Tài khoản:</strong> Máy đã được đăng xuất khỏi tất cả các tài khoản (iCloud, Google, Mi Account...).</li>
        </ul>

        <h3 class="policy-section__subtitle">Quy định về lỗi màn hình</h3>
        <ul class="policy-list">
          <li>Màn hình có từ <strong>3 điểm chết</strong> trở lên.</li>
          <li>Hoặc <strong>1 điểm chết</strong> có kích thước lớn hơn 1mm (điện thoại) và <strong>5 điểm chết</strong> trở lên (laptop, màn hình rời).</li>
        </ul>

        <div class="policy-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý về dữ liệu:</strong> Khách hàng vui lòng tự sao lưu dữ liệu. Cửa hàng không chịu trách nhiệm về việc mất dữ liệu trong mọi trường hợp.
          </div>
        </div>
      </section>

      <!-- II. Bảo hành tiêu chuẩn -->
      <section v-if="activeSection === 'standard'" class="policy-section">
        <h1 class="policy-section__title">II. Bảo hành tiêu chuẩn</h1>

        <h3 class="policy-section__subtitle">Điện thoại, Laptop</h3>
        <div class="policy-table-wrap">
          <table class="policy-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Thời gian bảo hành</th>
                <th>Quyền lợi bảo hành</th>
                <th>Địa chỉ bảo hành</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hàng mới</td>
                <td>12 tháng (hoặc dài hơn theo quy định hãng)</td>
                <td>Quyền lợi bảo hành của hãng</td>
                <td>TTBH chính hãng</td>
              </tr>
              <tr>
                <td>Hàng đã kích hoạt bảo hành chính hãng</td>
                <td>12 tháng = Thời gian BH còn lại tại hãng + BH tại CellphoneS</td>
                <td>Theo quyền lợi BH của hãng trong thời gian được hãng BH; Sửa chữa, thay thế linh kiện trong thời gian BH còn lại tại CellphoneS</td>
                <td>TTBH chính hãng &amp; CellphoneS / Điện Thoại Vui</td>
              </tr>
              <tr>
                <td>Hàng cũ</td>
                <td><strong>6 tháng</strong></td>
                <td>Sửa chữa, thay thế linh kiện, bao gồm cả nguồn và màn hình.</td>
                <td>CellphoneS / Điện Thoại Vui</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul class="policy-list">
          <li>Trong thời gian đợi bảo hành – sửa chữa, khách hàng sẽ được hỗ trợ miễn phí một điện thoại khác để sử dụng tạm thời.</li>
          <li>Khách hàng trả lại máy đã mượn sau khi nhận lại máy của mình.</li>
        </ul>

        <h3 class="policy-section__subtitle">Phụ kiện đi kèm máy</h3>
        <div class="policy-table-wrap">
          <table class="policy-table">
            <thead>
              <tr>
                <th>Hãng</th>
                <th>Thời gian BH</th>
                <th>Quyền lợi</th>
                <th>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Vsmart</td><td>6 tháng</td><td>1 đổi tất cả các lỗi</td><td>TTBH chính hãng</td></tr>
              <tr><td>Asus</td><td>6 tháng</td><td>1 đổi tất cả các lỗi</td><td>TTBH chính hãng</td></tr>
              <tr><td>Nokia</td><td>6 tháng</td><td>1 đổi tất cả các lỗi</td><td>TTBH chính hãng</td></tr>
            </tbody>
          </table>
        </div>

        <div class="policy-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý về dữ liệu:</strong> Khách hàng vui lòng tự sao lưu dữ liệu. Cửa hàng không chịu trách nhiệm về việc mất bất cứ dữ liệu nào trong mọi trường hợp.
          </div>
        </div>
      </section>

      <!-- III. Linh kiện máy tính -->
      <section v-if="activeSection === 'components'" class="policy-section">
        <h1 class="policy-section__title">III. Bảo hành linh kiện máy tính</h1>

        <div class="policy-table-wrap">
          <table class="policy-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Thời gian BH</th>
                <th>Quyền lợi BH (lỗi nhà sản xuất)</th>
                <th>Địa điểm</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Bộ vi xử lý – CPU</td><td><strong>36 tháng</strong></td><td>Đổi mới sau khi có xác nhận lỗi từ hãng</td><td>TTBH hãng</td></tr>
              <tr><td>Vỏ máy tính – Case</td><td>12 tháng</td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
              <tr><td>Bo mạch chủ – Mainboard</td><td><strong>36 tháng</strong></td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
              <tr><td>Nguồn – PSU</td><td><strong>36 tháng</strong></td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
              <tr><td>RAM PC/Laptop</td><td><strong>36 tháng</strong></td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
              <tr><td>Ổ cứng – SSD/HDD</td><td><strong>36 tháng</strong></td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
              <tr><td>Card màn hình – VGA</td><td><strong>36 tháng</strong></td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
              <tr><td>Tản nhiệt – Fan/Cooling</td><td>12 tháng</td><td>Sửa chữa hoặc đổi tương đương</td><td>TTBH hãng</td></tr>
            </tbody>
          </table>
        </div>

        <h3 class="policy-section__subtitle">Điều kiện bảo hành</h3>
        <h4 class="policy-section__sub-subtitle">Đủ điều kiện</h4>
        <ul class="policy-list">
          <li>Hư hỏng được xác định do lỗi kỹ thuật hoặc lỗi của nhà sản xuất.</li>
          <li>Sản phẩm còn trong thời hạn bảo hành, có tem bảo hành của nhà phân phối hoặc hãng sản xuất.</li>
          <li>Với sản phẩm cần số serial hoặc hộp, sản phẩm phải còn đầy đủ những thứ này.</li>
          <li>Sản phẩm không trầy xước, cấn móp, bể, vỡ, biến dạng so với ban đầu.</li>
          <li>Dùng đúng nguồn điện, không bị mối mọt, không nằm trong môi trường cháy nổ, phòng tủ không bị rỉ oxy hóa do đặt trong môi trường ẩm ướt.</li>
          <li>Chưa có sự can thiệp vào phần cứng (tự ý tháo dỡ, sửa chữa...).</li>
          <li><strong>CPU Intel:</strong> Khách hàng cần giữ hộp nhựa đựng sản phẩm trong suốt thời gian bảo hành.</li>
          <li><strong>Ổ cứng SSD:</strong> Bảo hành theo số tháng quy định hoặc theo chỉ số TBW của nhà sản xuất, tùy điều kiện nào đến trước.</li>
        </ul>

        <h4 class="policy-section__sub-subtitle">Không đủ điều kiện (Từ chối bảo hành)</h4>
        <ul class="policy-list">
          <li>Hết thời hạn bảo hành.</li>
          <li>CPU bị mẻ, nứt hoặc cong chân.</li>
          <li>Không có tem bảo hành của Công ty/nhà phân phối/hãng hoặc tem bảo hành bị rách, tẩy xóa, sửa chống, không đọc được, bong tróc.</li>
          <li>Tác động vật lý làm trầy xước, cong vênh, rạn nứt, bể, vỡ trong quá trình sử dụng.</li>
          <li>Tự ý tháo mở, sửa chữa, thay đổi cấu trúc sản phẩm bên trong.</li>
          <li>Hư hỏng, cháy, nổ do sử dụng sai mục đích, tự ý tháo lắp đặt không tuân theo hướng dẫn.</li>
          <li>Hư hỏng do côn trùng xâm nhập (chuột, gián, kiến, mối...).</li>
          <li>Hư hỏng do thiên tai, hỏa hoạn, lũ lụt, sét đánh, rỉ sét, hao mòn do môi trường.</li>
          <li>Sản phẩm sử dụng với mục đích sản xuất, khai thác tiền điện tử (đào coin).</li>
        </ul>

        <div class="policy-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý về dữ liệu:</strong> Quý khách vui lòng chủ động sao lưu dữ liệu cá nhân trước khi gửi bảo hành. CellphoneS và TTBH không chịu trách nhiệm về mất mát dữ liệu trong mọi trường hợp.
          </div>
        </div>
      </section>

      <!-- IV. Bảo hành 1 đổi 1 VIP -->
      <section v-if="activeSection === 'vip'" class="policy-section">
        <h1 class="policy-section__title">IV. Bảo hành 1 đổi 1 VIP</h1>
        <p class="policy-section__desc">Áp dụng cho điện thoại, máy tính bảng (mới/cũ), tai nghe cao cấp mới, đồng hồ thông minh (không bao gồm Apple/Samsung mới). Thời gian: <strong>06 – 12 tháng</strong> tùy dòng máy.</p>

        <div class="policy-table-wrap">
          <table class="policy-table">
            <thead>
              <tr>
                <th>Phạm vi bảo hành</th>
                <th>Bảo hành tiêu chuẩn</th>
                <th>Bảo hành 1 đổi 1 – VIP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Mainboard</strong> (nguồn, ổ cứng)</td>
                <td>Sửa chữa / Thay thế linh kiện</td>
                <td><strong>1 đổi 1</strong> máy tương đương</td>
              </tr>
              <tr>
                <td><strong>Màn hình, cảm ứng</strong> (điểm chết &gt;3, điểm đen &gt;1mm)</td>
                <td>Sửa chữa / Thay thế</td>
                <td><strong>1 đổi 1</strong> máy tương đương</td>
              </tr>
              <tr>
                <td><strong>Linh kiện khác</strong> (camera, loa, wifi, chân sạc...)</td>
                <td>Sửa chữa</td>
                <td><strong>1 đổi 1</strong> máy tương đương</td>
              </tr>
              <tr>
                <td><strong>Pin và phím vật lý</strong></td>
                <td>Bảo hành 6 tháng (iPhone cũ: 3 tháng)</td>
                <td><strong>1 đổi 1 trong 12 tháng</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="policy-section__note"><em>* Pin được xác định lỗi khi hao trên 20% sau 1 giờ xem Youtube (wifi, độ sáng/âm lượng 50%) hoặc bị phồng.</em></p>

        <h3 class="policy-section__subtitle">Thời gian xử lý</h3>
        <ul class="policy-list">
          <li><strong>Điện thoại, máy tính bảng, laptop (trừ Apple):</strong> 03 – 05 ngày làm việc.</li>
          <li><strong>Sản phẩm Apple:</strong> 03 – 05 ngày (tại CareS) hoặc 07 – 10 ngày (tại TTBH ủy quyền).</li>
          <li><strong>Phụ kiện và Tivi:</strong> 07 – 10 ngày làm việc.</li>
          <li><strong>Tổng thời gian thông thường:</strong> 07 – 14 ngày làm việc.</li>
        </ul>

        <h3 class="policy-section__subtitle">Đổi sang máy giá trị cao hơn</h3>
        <div class="policy-highlight">
          Giá nhập lại = <strong>Giá bán hiện tại của máy cũ × 90%</strong>
        </div>

        <h3 class="policy-section__subtitle">Trường hợp hết hàng để đổi</h3>
        <p>Nếu quá <strong>07 ngày</strong> mà không có máy đổi, cửa hàng sẽ nhập lại máy theo công thức:</p>
        <div class="policy-highlight">
          Giá trị nhập lại = <strong>Giá mua ban đầu × [100% − (5% × số tháng sử dụng)]</strong>
        </div>
        <p class="policy-section__note"><em>* Thiếu hộp/phụ kiện sẽ trừ phí thêm khoảng 5% giá trị máy.</em></p>

        <h3 class="policy-section__subtitle">Đặc quyền</h3>
        <ul class="policy-list">
          <li>Khách hàng có thể chuyển nhượng quyền sở hữu máy và gói bảo hành VIP trong thời gian bảo hành.</li>
          <li>Được tặng thêm <strong>+5% giá trị thu mua</strong> khi có nhu cầu lên đời máy mới.</li>
        </ul>

        <div class="policy-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý về dữ liệu:</strong> Khách hàng cần tự sao lưu dữ liệu trước khi bảo hành. Cửa hàng không chịu trách nhiệm về mất mát dữ liệu.
          </div>
        </div>
      </section>

      <!-- V. Bảo hành rơi vỡ, ngấm nước -->
      <section v-if="activeSection === 'accidental'" class="policy-section">
        <h1 class="policy-section__title">V. Bảo hành rơi vỡ, ngấm nước</h1>
        <p class="policy-section__desc">Áp dụng cho điện thoại, máy tính bảng mới/cũ (có giới hạn đối tượng sản phẩm áp dụng). Thời gian bảo hành: <strong>12 tháng</strong>.</p>

        <h3 class="policy-section__subtitle">Điều kiện bảo hành</h3>
        <ul class="policy-list">
          <li>Sản phẩm bị tác động của ngoại lực, gây vỡ hoặc bị ngấm nước, ngấm các chất lỏng khác dẫn đến sản phẩm không hoạt động bình thường.</li>
          <li>Sản phẩm phải còn trong tình trạng có thể xác định được mã số IMEI/Serial định danh sản phẩm. Trường hợp không thể xác định được, CellphoneS từ chối bảo hành.</li>
        </ul>

        <h3 class="policy-section__subtitle">Quyền lợi bảo hành</h3>
        <ul class="policy-list">
          <li>Sản phẩm được sửa chữa/thay thế linh kiện tại các TTBH ủy quyền.</li>
          <li><strong>Chi phí dịch vụ:</strong> Khách hàng chịu phí <strong>10% chi phí sửa chữa/thay thế linh kiện</strong>.</li>
          <li><strong>Giới hạn chi phí:</strong> Tổng chi phí cho các lần sửa chữa không vượt quá giá niêm yết của sản phẩm tại thời điểm mua. Nếu vượt quá, khách hàng chịu phần chênh lệch.</li>
        </ul>

        <h3 class="policy-section__subtitle">Trường hợp không thể sửa chữa</h3>
        <ul class="policy-list">
          <li>CellphoneS sẽ đổi cho khách hàng một sản phẩm cũ có chất lượng tương đương.</li>
          <li>Khách hàng chịu phí dịch vụ <strong>10% giá trị của sản phẩm được đổi</strong>.</li>
          <li>Sau khi đổi, gói bảo hành này hết hiệu lực và sản phẩm được đổi sẽ được bảo hành <strong>06 tháng</strong> theo chính sách của CellphoneS.</li>
          <li>Chỉ áp dụng đổi máy, không đổi hộp và phụ kiện kèm theo (sạc, cáp...).</li>
        </ul>

        <h3 class="policy-section__subtitle">Đặc quyền thêm</h3>
        <div class="policy-highlight">
          Khách hàng sử dụng dịch vụ này có đặc quyền <strong>+3% tổng giá trị máy thu cũ</strong> khi lên đời trong thời gian bảo hành của thiết bị.
        </div>

        <div class="policy-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý quan trọng:</strong> CellphoneS không chịu trách nhiệm về việc mất dữ liệu trong mọi trường hợp. Khách hàng nên chủ động sao lưu dữ liệu trước khi mang đi bảo hành.
          </div>
        </div>
      </section>

      <!-- VI. Bảo hành mở rộng S24+ -->
      <section v-if="activeSection === 's24plus'" class="policy-section">
        <h1 class="policy-section__title">VI. Bảo hành mở rộng S24+</h1>
        <p class="policy-section__desc">Áp dụng cho Macbook, Điện thoại. Thời gian tổng cộng: <strong>24 – 36 tháng</strong> (đã bao gồm 12 tháng bảo hành tiêu chuẩn từ nhà sản xuất). Gói bảo hành có hiệu lực ngay sau khi thời hạn bảo hành của nhà sản xuất kết thúc.</p>

        <h3 class="policy-section__subtitle">Quyền lợi bảo hành</h3>
        <ul class="policy-list">
          <li><strong>Sửa chữa miễn phí 100%:</strong> Miễn phí chi phí sửa chữa và thay thế linh kiện nếu sản phẩm gặp lỗi từ nhà sản xuất.</li>
          <li><strong>Thời gian xử lý:</strong> 07 – 14 ngày làm việc. Riêng Macbook có thể kéo dài 03 tuần đến 01 tháng.</li>
          <li><strong>Chuyển nhượng:</strong> Khách hàng có thể chuyển nhượng quyền sở hữu sản phẩm kèm gói bảo hành S24+ cho người khác.</li>
          <li><strong>Đặc quyền lên đời:</strong> Được cộng thêm <strong>+3% tổng giá trị máy thu cũ</strong> khi thu cũ đổi mới.</li>
        </ul>

        <h3 class="policy-section__subtitle">Không thể sửa chữa được</h3>
        <p>Nếu máy bị lỗi nhà sản xuất nhưng không thể sửa chữa, CellphoneS giải quyết theo thứ tự:</p>
        <ul class="policy-list">
          <li><strong>Bước 1:</strong> Đổi sản phẩm tương đương cùng thương hiệu, dòng sản phẩm, có chất lượng tương đương tại thời điểm bảo hành.</li>
          <li><strong>Bước 2:</strong> Nếu không có sản phẩm để đổi, nhập lại (hoàn tiền) theo công thức:</li>
        </ul>
        <div class="policy-highlight">
          Giá nhập lại = <strong>Giá mua sản phẩm × (100% − 3% × Số tháng đã sử dụng)</strong>
        </div>

        <h3 class="policy-section__subtitle">Các trường hợp KHÔNG được bảo hành S24+</h3>
        <ul class="policy-list">
          <li>Các hư hỏng do người dùng gây ra như: rơi vỡ, vào nước...</li>
          <li>Các vấn đề liên quan đến <strong>pin</strong> và <strong>phím vật lý</strong>.</li>
        </ul>

        <h3 class="policy-section__subtitle">Ví dụ minh họa</h3>
        <div class="policy-example">
          <p>Nếu bạn mua tai nghe giá <strong>4.800.000đ</strong> kèm gói S24+, sau <strong>15 tháng</strong> sử dụng nếu bị lỗi nhà sản xuất mà không sửa được:</p>
          <ul class="policy-list" style="margin-top: 8px;">
            <li>Bạn có thể được đổi một tai nghe cũ tương đương.</li>
            <li>Hoặc được nhập lại với giá <strong>2.640.000đ</strong> (tức 4.800.000 × 55%) để đổi sang sản phẩm khác hoặc nhận lại tiền.</li>
          </ul>
        </div>

        <div class="policy-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý quan trọng:</strong> Khách hàng nên chủ động sao lưu dữ liệu cá nhân trước khi mang máy đi bảo hành vì cửa hàng không chịu trách nhiệm về mất mát dữ liệu.
          </div>
        </div>
      </section>

    </main>
  </div>
</ProfileLayout>
</template>

<script setup>
import { ref } from 'vue'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })

useHead({ title: 'Chính sách bảo hành - IrusGear' })

const activeSection = ref('return')

const sidebarItems = [
  { key: 'return', label: 'I. Đổi mới 30 ngày miễn phí' },
  { key: 'standard', label: 'II. Bảo hành tiêu chuẩn' },
  { key: 'components', label: 'III. Linh kiện máy tính' },
  { key: 'vip', label: 'IV. Bảo hành 1 đổi 1 VIP' },
  { key: 'accidental', label: 'V. Bảo hành rơi vỡ, ngấm nước' },
  { key: 's24plus', label: 'VI. Bảo hành mở rộng S24+' },
]
</script>

<style scoped>
/* ── Layout ──────────────────────────────── */
.policy-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ─────────────────────────────── */
.policy-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #ececf1;
  scrollbar-width: thin;
  scrollbar-color: #e4e4e7 transparent;
}

.policy-sidebar::-webkit-scrollbar { width: 4px; }
.policy-sidebar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 999px; }

.policy-sidebar__section {
  padding: 8px 0;
}

.policy-sidebar__title {
  padding: 12px 20px 6px;
  font-size: 11px;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.policy-sidebar__item {
  display: block;
  width: 100%;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #52525b;
  background: none;
  border: none;
  border-left: 4px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  line-height: 1.4;
}

.policy-sidebar__item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.policy-sidebar__item--active {
  background: #fef2f2;
  color: #d70018;
  font-weight: 600;
  border-left-color: #d70018;
}

.policy-sidebar__item--active:hover {
  background: #fef2f2;
  color: #d70018;
}

/* ── Content ──────────────────────────────── */
.policy-content {
  flex: 1;
  min-width: 0;
}

/* ── Section ─────────────────────────────── */
.policy-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 28px 28px 32px;
}

.policy-section__title {
  font-size: 20px;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 8px;
  line-height: 1.3;
}

.policy-section__desc {
  font-size: 14px;
  color: #52525b;
  margin: 0 0 24px;
  line-height: 1.6;
}

.policy-section__subtitle {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 28px 0 12px;
}

.policy-section__sub-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #52525b;
  margin: 20px 0 10px;
}

.policy-section__note {
  font-size: 13px;
  color: #71717a;
  margin: 8px 0;
  font-style: italic;
}

/* ── Lists ───────────────────────────────── */
.policy-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy-list li {
  font-size: 14px;
  color: #3f3f46;
  line-height: 1.6;
}

.policy-list li strong {
  color: #18181b;
}

/* ── Table ───────────────────────────────── */
.policy-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  margin-bottom: 8px;
}

.policy-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.policy-table thead tr {
  background: #f4f4f5;
}

.policy-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  color: #18181b;
  font-size: 13px;
  border-bottom: 1px solid #e4e4e7;
  white-space: nowrap;
}

.policy-table td {
  padding: 12px 16px;
  color: #3f3f46;
  line-height: 1.5;
  border-bottom: 1px solid #f4f4f5;
  vertical-align: top;
}

.policy-table tbody tr:last-child td {
  border-bottom: none;
}

.policy-table tbody tr:hover td {
  background: #fafafa;
}

.policy-table td strong {
  color: #18181b;
}

/* ── Notice ──────────────────────────────── */
.policy-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  margin-top: 24px;
}

.policy-notice svg {
  color: #71717a;
  flex-shrink: 0;
  margin-top: 2px;
}

.policy-notice div {
  font-size: 13px;
  color: #52525b;
  line-height: 1.6;
}

.policy-notice strong {
  color: #18181b;
}

/* ── Highlight ───────────────────────────── */
.policy-highlight {
  padding: 14px 18px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 14px;
  color: #18181b;
  line-height: 1.6;
  margin: 12px 0;
}

.policy-highlight strong {
  color: #d70018;
}

/* ── Example Box ─────────────────────────── */
.policy-example {
  padding: 16px 18px;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  margin-top: 12px;
}

.policy-example p {
  font-size: 14px;
  color: #3f3f46;
  margin: 0;
  line-height: 1.6;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 991.98px) {
  .policy-layout {
    flex-direction: column;
  }

  .policy-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
  }

  .policy-sidebar__section {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 4px;
    padding: 8px;
    scrollbar-width: none;
  }

  .policy-sidebar__section::-webkit-scrollbar {
    display: none;
  }

  .policy-sidebar__title {
    width: 100%;
    padding: 4px 8px;
    font-size: 10px;
  }

  .policy-sidebar__item {
    padding: 8px 12px;
    font-size: 12px;
    border-left: none;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    background: #fff;
    white-space: nowrap;
  }

  .policy-sidebar__item--active {
    background: #d70018;
    color: #fff;
    border-color: #d70018;
  }

  .policy-sidebar__item--active:hover {
    background: #b80015;
    color: #fff;
  }

  .policy-section {
    padding: 20px 16px 24px;
    border-radius: 14px;
  }

  .policy-section__title {
    font-size: 18px;
  }

  .policy-section__subtitle {
    font-size: 14px;
  }

  .policy-table th,
  .policy-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
}

@media (max-width: 767.98px) {
  .policy-sidebar__item {
    font-size: 12px;
    padding: 7px 10px;
  }

  .policy-section {
    padding: 16px 14px 20px;
  }

  .policy-section__title {
    font-size: 17px;
  }

  .policy-section__subtitle {
    font-size: 14px;
  }

  .policy-notice {
    padding: 12px 14px;
  }

  .policy-highlight {
    padding: 12px 14px;
  }

  .policy-example {
    padding: 14px;
  }

  .policy-table th,
  .policy-table td {
    padding: 8px 10px;
    font-size: 12px;
  }
}

@media (max-width: 575.98px) {
  .policy-sidebar__item {
    font-size: 11px;
    padding: 6px 10px;
  }

  .policy-section {
    padding: 14px 12px 18px;
  }

  .policy-section__title {
    font-size: 16px;
  }

  .policy-section__subtitle {
    font-size: 13px;
    margin: 20px 0 10px;
  }

  .policy-section__desc {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .policy-list {
    padding-left: 18px;
    gap: 6px;
  }

  .policy-list li {
    font-size: 13px;
  }

  .policy-table-wrap {
    border-radius: 8px;
  }

  .policy-table th,
  .policy-table td {
    padding: 8px 10px;
    font-size: 11px;
  }

  .policy-notice {
    padding: 10px 12px;
    margin-top: 20px;
    gap: 8px;
  }

  .policy-notice div {
    font-size: 12px;
  }

  .policy-highlight {
    padding: 10px 12px;
    font-size: 13px;
    margin: 10px 0;
  }

  .policy-example {
    padding: 12px;
    margin-top: 10px;
  }

  .policy-example p {
    font-size: 13px;
  }

  .policy-section__note {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .policy-sidebar__item {
    font-size: 11px;
    padding: 5px 8px;
    border-radius: 6px;
  }

  .policy-section {
    padding: 12px 10px 16px;
    border-radius: 12px;
  }

  .policy-section__title {
    font-size: 15px;
  }

  .policy-section__subtitle {
    font-size: 13px;
    margin: 16px 0 8px;
  }

  .policy-section__desc {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .policy-list {
    padding-left: 16px;
    gap: 5px;
  }

  .policy-list li {
    font-size: 12px;
    line-height: 1.5;
  }

  .policy-table th,
  .policy-table td {
    padding: 7px 8px;
    font-size: 11px;
  }

  .policy-notice {
    padding: 8px 10px;
    margin-top: 16px;
  }

  .policy-notice svg {
    width: 14px;
    height: 14px;
  }

  .policy-highlight {
    padding: 8px 10px;
    font-size: 12px;
  }

  .policy-example {
    padding: 10px;
  }
}

@media (min-width: 1200px) {
  .policy-sidebar {
    width: 300px;
  }

  .policy-section {
    padding: 32px 36px 36px;
  }

  .policy-section__title {
    font-size: 22px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .policy-layout {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .policy-layout {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .policy-layout {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .policy-layout {
    padding-bottom: 80px;
  }
}
</style>
