<template>
  <div class="tos-layout">
    <!-- Sidebar -->
    <aside class="tos-sidebar">
      <div class="tos-sidebar__section">
        <div class="tos-sidebar__title">Quy chế</div>
        <button
          v-for="item in sidebarItems"
          :key="item.key"
          type="button"
          class="tos-sidebar__item"
          :class="{ 'tos-sidebar__item--active': activeSection === item.key }"
          @click="activeSection = item.key"
        >
          {{ item.label }}
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="tos-content">

      <!-- I. Quy định chung -->
      <section v-if="activeSection === 'general'" class="tos-section">
        <h1 class="tos-section__title">I. Quy định chung</h1>

        <h3 class="tos-section__subtitle">1. Nguyên tắc chung</h3>
        <ul class="tos-list">
          <li>
            Website thương mại điện tử <strong>cellphones.com.vn</strong> là sở hữu của Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc ("Công ty") do Công ty phát triển, hoạt động và vận hành với tên miền giao dịch là <strong>www.cellphones.com.vn</strong> (sau đây gọi là Website). Đối tượng phục vụ là tất cả các khách hàng có nhu cầu mua hàng, đặt hàng thông qua Website.
          </li>
          <li>
            Sản phẩm được kinh doanh tại Cellphones.com.vn phải đáp ứng đầy đủ các quy định của nhà nước về nguồn gốc, xuất xứ hàng hóa, chất lượng sản phẩm.
          </li>
          <li>
            Hoạt động mua bán tại Cellphones.com.vn phải được thực hiện công khai, minh bạch, đảm bảo quyền lợi của người tiêu dùng.
          </li>
        </ul>

        <h3 class="tos-section__subtitle">2. Định nghĩa</h3>
        <ul class="tos-list">
          <li>
            <strong>Người bán</strong>: là Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc.
          </li>
          <li>
            <strong>Người mua</strong>: là mọi công dân sinh sống trong lãnh thổ Việt Nam.
          </li>
          <li>
            <strong>Thành viên</strong>: là bao gồm cả người mua và người tham gia tham khảo thông tin, thảo luận tại Website.
          </li>
          <li>
            Thành viên khi tham gia Website phải tự tìm hiểu trách nhiệm pháp lý của mình đối với luật pháp hiện hành của Việt Nam và cam kết thực hiện đúng những nội dung trong Quy chế này.
          </li>
        </ul>
      </section>

      <!-- II. Quy trình giao dịch -->
      <section v-if="activeSection === 'transaction'" class="tos-section">
        <h1 class="tos-section__title">II. Quy trình giao dịch</h1>

        <h3 class="tos-section__subtitle">1. Quy trình mua hàng trên Website</h3>
        <ul class="tos-list">
          <li>
            <strong>Bước 1:</strong> Khách hàng tìm kiếm sản phẩm, đọc và đồng ý với các quy định trong "Quy chế hoạt động website cung cấp dịch vụ TMĐT Cellphones.com.vn".
          </li>
          <li>
            <strong>Bước 2:</strong> Xem giá và thông tin chi tiết sản phẩm. Nếu đồng ý mua, tùy theo nhu cầu và sản phẩm cụ thể, bấm một trong các nút: <strong>"Mua ngay (giao hàng tận nơi hoặc nhận tại cửa hàng)"</strong>, <strong>"Trả góp (duyệt qua điện thoại)"</strong>, hoặc <strong>"Trả góp qua thẻ (Visa, Master, JCB)"</strong>.
          </li>
          <li>
            <strong>Bước 3:</strong> Khách hàng nhập thông tin đặt hàng theo hướng dẫn tại mỗi mục mua hàng đã chọn ở trên. Nếu có mã khuyến mãi, nhập trực tiếp vào phiếu đặt hàng.
          </li>
          <li>
            <strong>Bước 4:</strong> Sau khi nhận được đơn đặt hàng của khách, Cellphones.com.vn sẽ liên hệ qua số điện thoại đã cung cấp qua tổng đài <strong>1800.2063</strong> để xác nhận thông tin đơn hàng.
          </li>
          <li>
            <strong>Bước 5:</strong> Cellphones.com.vn giao hàng tận nơi hoặc khách hàng đến các cửa hàng CellphoneS toàn quốc để nhận hàng.
          </li>
        </ul>

        <h3 class="tos-section__subtitle">2. Quy trình giao hàng và vận chuyển</h3>
        <p class="tos-section__text">
          Cellphones.com.vn miễn phí giao hàng toàn quốc. Sau khi tiếp nhận đơn đặt hàng của người mua và xác nhận thông tin mua hàng qua điện thoại, Cellphones.com.vn sẽ tiến hành giao hàng theo yêu cầu của khách.
        </p>

        <div class="tos-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Lưu ý quan trọng:</strong> Với giao dịch có giá trị từ <strong>10 triệu đồng trở lên</strong>, khách hàng vui lòng xuất trình <strong>THẺ GỐC</strong> và <strong>CCCD/CMND GỐC</strong> của <strong>CHỦ THẺ</strong> để CellphoneS đối chiếu trước khi giao hàng nhằm phòng tránh trường hợp gian lận. Trường hợp người nhận hàng không phải là <strong>CHỦ THẺ</strong> hoặc phát hiện có vấn đề về giao dịch, CellphoneS có quyền hủy giao dịch và hoàn tiền cho <strong>CHỦ THẺ</strong>. Thời gian xử lý hoàn tiền từ <strong>7 – 14 ngày</strong> (không tính thứ 7, CN).
          </div>
        </div>
      </section>

      <!-- III. Chính sách bảo hành sản phẩm -->
      <section v-if="activeSection === 'warranty'" class="tos-section">
        <h1 class="tos-section__title">III. Chính sách bảo hành sản phẩm</h1>

        <h3 class="tos-section__subtitle">1. Chính sách đổi mới 30 ngày miễn phí</h3>
        <p class="tos-section__text">
          Khách hàng được đổi mới miễn phí 1 đổi 1 hoặc hoàn tiền 100% trong 30 ngày đầu tiên đối với lỗi phần cứng từ nhà sản xuất.
        </p>

        <div class="tos-table-wrap">
          <table class="tos-table">
            <thead>
              <tr>
                <th>Nhóm sản phẩm</th>
                <th>Thời gian đổi mới</th>
                <th>Quy định nhập lại / Hoàn tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Điện thoại, Máy tính bảng, Macbook, Apple Watch</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày: hoàn tiền <strong>80%</strong> giá hiện tại hoặc giá mua (lấy mức thấp hơn). Sau 30 ngày: theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Samsung Watch</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày: hoàn tiền <strong>80%</strong> giá hiện tại hoặc giá mua (lấy mức thấp hơn). Sau 30 ngày: theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Laptop</td>
                <td>30 ngày</td>
                <td>Trong 30 ngày: hoàn tiền <strong>80%</strong> giá hiện tại. Sau 30 ngày: không nhập lại.</td>
              </tr>
              <tr>
                <td>Phụ kiện dưới 1 triệu</td>
                <td>1 năm (mới) / 1 tháng (đã sử dụng)</td>
                <td>Không nhập lại / hoàn tiền.</td>
              </tr>
              <tr>
                <td>Phụ kiện từ 1 triệu trở lên</td>
                <td>15 ngày</td>
                <td>Trong 30 ngày: hoàn tiền <strong>80%</strong> giá. Sau 30 ngày: theo giá thỏa thuận.</td>
              </tr>
              <tr>
                <td>Gói bảo hành mở rộng</td>
                <td>Không đổi</td>
                <td>Trong 7 ngày (không lỗi): nhập lại <strong>50%</strong> giá gói.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="tos-section__subtitle">2. Điều kiện đổi mới / Hoàn tiền</h3>
        <ul class="tos-list">
          <li><strong>Máy mới:</strong> Như mới, không trầy xước, không dán decal, hình trang trí.</li>
          <li><strong>Hộp:</strong> Như mới, không móp méo, rách, viết vẽ. Số Serial/IMEI trên hộp trùng với thân máy.</li>
          <li><strong>Phụ kiện và quà tặng:</strong> Còn đầy đủ, nguyên vẹn, không móp méo hoặc hư hại.</li>
          <li><strong>Tài khoản:</strong> Máy đã đăng xuất khỏi tất cả tài khoản (iCloud, Google, Mi Account...).</li>
          <li><strong>Lỗi màn hình:</strong> Từ 3 điểm chết trở lên, hoặc 1 điểm chết kích thước lớn hơn 1mm (điện thoại) và từ 5 điểm chết trở lên (laptop, màn hình rời).</li>
        </ul>

        <h3 class="tos-section__subtitle">3. Bảo hành tiêu chuẩn</h3>
        <div class="tos-table-wrap">
          <table class="tos-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Thời gian bảo hành</th>
                <th>Nơi bảo hành</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hàng mới</td>
                <td>12 tháng theo chính sách hãng</td>
                <td>TTBH chính hãng</td>
              </tr>
              <tr>
                <td>Hàng đã kích hoạt bảo hành chính hãng</td>
                <td>12 tháng (BH còn lại tại hãng + BH tại CellphoneS)</td>
                <td>TTBH chính hãng &amp; CellphoneS / Điện Thoại Vui</td>
              </tr>
              <tr>
                <td>Hàng đã sử dụng</td>
                <td><strong>6 tháng</strong></td>
                <td>CellphoneS / Điện Thoại Vui</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="tos-section__text">
          Phụ kiện đi kèm Vsmart, Asus, Nokia có thời gian bảo hành <strong>6 tháng</strong>. Khách hàng có thể được hỗ trợ một điện thoại khác để sử dụng tạm trong thời gian chờ bảo hành.
        </p>
      </section>

      <!-- IV. Chính sách hủy giao dịch, đổi trả hàng -->
      <section v-if="activeSection === 'cancellation'" class="tos-section">
        <h1 class="tos-section__title">IV. Chính sách hủy giao dịch, đổi trả hàng</h1>

        <h3 class="tos-section__subtitle">1. Chính sách hủy đơn hàng</h3>
        <p class="tos-section__text">
          Khách hàng có thể hủy đơn từ lúc "Đặt hàng" đến trước khi nhận hàng thành công.
        </p>
        <ul class="tos-list">
          <li>Gọi tổng đài: <strong>1800.2097</strong> (miền Nam) hoặc <strong>1800.2044</strong> (miền Bắc).</li>
          <li>Gửi email: <strong>cskh@cellphones.com.vn</strong>.</li>
          <li>Nhắn tin Fanpage CellphoneS.</li>
          <li>Từ chối nhận hàng và xác nhận hủy với đơn vị giao hàng.</li>
        </ul>

        <h3 class="tos-section__subtitle">2. Chính sách đổi trả</h3>
        <div class="tos-table-wrap">
          <table class="tos-table">
            <thead>
              <tr>
                <th>Nhóm sản phẩm</th>
                <th>Thời gian đổi trả (Mới / Đã sử dụng)</th>
                <th>Phí hoàn (nếu có)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Điện thoại, Máy tính bảng, Macbook</td>
                <td>30 ngày / 30 ngày</td>
                <td>20% giá trị (mới) / 15% giá trị (đã sử dụng)</td>
              </tr>
              <tr>
                <td>Apple Watch</td>
                <td>30 ngày / 30 ngày</td>
                <td>20% / 20%</td>
              </tr>
              <tr>
                <td>Samsung Watch</td>
                <td>30 ngày / 30 ngày</td>
                <td>30% / 30%</td>
              </tr>
              <tr>
                <td>Laptop</td>
                <td>30 ngày / 30 ngày</td>
                <td>20% (mới) / Không áp dụng</td>
              </tr>
              <tr>
                <td>Phụ kiện dưới 1 triệu</td>
                <td>1 năm / 30 ngày</td>
                <td>Không áp dụng</td>
              </tr>
              <tr>
                <td>Phụ kiện từ 1 triệu trở lên</td>
                <td>15 ngày / 15 ngày</td>
                <td>Không áp dụng</td>
              </tr>
              <tr>
                <td>Gói bảo hành mở rộng</td>
                <td>Không đổi / Không trả</td>
                <td>Phí 50% (trả trong 7 ngày)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="tos-section__text"><em>* Riêng AirPods: phí hoàn 20%.</em></p>
        <p class="tos-section__text"><em>* Đơn hàng online: thời gian tính từ ngày nhận hàng, không quá 7 ngày kể từ ngày xuất hóa đơn.</em></p>

        <h3 class="tos-section__subtitle">3. Điều kiện đổi trả</h3>
        <ul class="tos-list">
          <li><strong>Máy:</strong> Như mới, không trầy xước, không móp méo, không bong tróc, không dính nước.</li>
          <li><strong>Hộp:</strong> Nguyên vẹn, không rách, không ố vàng, Serial/IMEI trùng khớp.</li>
          <li><strong>Phụ kiện &amp; quà tặng:</strong> Còn đầy đủ, nguyên vẹn.</li>
          <li><strong>Tài khoản:</strong> Đã đăng xuất khỏi iCloud, Google, Mi Account...</li>
        </ul>

        <h3 class="tos-section__subtitle">4. Chính sách hoàn tiền</h3>
        <div class="tos-table-wrap">
          <table class="tos-table">
            <thead>
              <tr>
                <th>Phương thức thanh toán</th>
                <th>Thời gian xử lý hoàn tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Tiền mặt</td><td>Hoàn ngay tại cửa hàng</td></tr>
              <tr><td>Chuyển khoản ngân hàng</td><td>2 ngày làm việc</td></tr>
              <tr><td>Thẻ ATM</td><td>7 – 10 ngày làm việc</td></tr>
              <tr><td>Visa / Master / JCB</td><td>7 – 15 ngày làm việc</td></tr>
              <tr><td>MPOS / ALEPAY</td><td>7 – 10 ngày làm việc</td></tr>
              <tr><td>VNPAY</td><td>3 – 8 ngày làm việc</td></tr>
              <tr><td>MOCA</td><td>3 – 5 ngày làm việc</td></tr>
            </tbody>
          </table>
        </div>
        <p class="tos-section__text"><em>* Ngày làm việc: thứ 2 đến thứ 6 hàng tuần (không tính T7, CN, ngày lễ).</em></p>
      </section>

      <!-- V. Chính sách bảo mật thông tin khách hàng Cellphones -->
      <section v-if="activeSection === 'privacy-cellphones'" class="tos-section">
        <h1 class="tos-section__title">V. Chính sách bảo mật thông tin khách hàng Cellphones</h1>

        <h3 class="tos-section__subtitle">1. Mục đích thu thập thông tin</h3>
        <ul class="tos-list">
          <li>Xử lý đơn hàng và cung cấp dịch vụ cho khách hàng.</li>
          <li>Gửi thông báo về tình trạng đơn hàng, khuyến mãi và sản phẩm mới (khi có sự đồng ý).</li>
          <li>Hỗ trợ khách hàng, giải quyết khiếu nại và các vấn đề liên quan.</li>
          <li>Giám sát an ninh, phòng chống gian lận và hoạt động bất hợp pháp.</li>
          <li>Thực hiện các nghĩa vụ pháp lý theo yêu cầu của cơ quan nhà nước có thẩm quyền.</li>
        </ul>

        <h3 class="tos-section__subtitle">2. Phạm vi sử dụng thông tin</h3>
        <ul class="tos-list">
          <li>Thông tin được sử dụng nội bộ bởi Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc.</li>
          <li>Không cung cấp thông tin cá nhân cho bên thứ ba khi chưa có sự đồng ý của khách hàng, trừ các trường hợp pháp luật yêu cầu.</li>
        </ul>

        <h3 class="tos-section__subtitle">3. Thời gian lưu trữ</h3>
        <p class="tos-section__text">
          Thông tin được lưu trữ cho đến khi khách hàng yêu cầu xóa, tài khoản đóng hoặc theo quy định pháp luật.
        </p>

        <h3 class="tos-section__subtitle">4. Quyền của khách hàng</h3>
        <ul class="tos-list">
          <li>Truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình.</li>
          <li>Rút lại sự đồng ý thu thập dữ liệu bất kỳ lúc nào.</li>
          <li>Khiếu nại về việc xử lý thông tin cá nhân.</li>
        </ul>

        <h3 class="tos-section__subtitle">5. Thông tin liên hệ</h3>
        <ul class="tos-list">
          <li><strong>Công ty:</strong> Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc.</li>
          <li><strong>Địa chỉ:</strong> 350-352 Võ Văn Kiệt, Phường Cô Giang, Quận 1, TP. Hồ Chí Minh.</li>
          <li><strong>Điện thoại:</strong> 1800.2097.</li>
          <li><strong>Email:</strong> cskh@cellphones.com.vn.</li>
        </ul>
      </section>

      <!-- VI. Chính sách bảo mật thông tin khách hàng Sforum -->
      <section v-if="activeSection === 'privacy-sforum'" class="tos-section">
        <h1 class="tos-section__title">VI. Chính sách bảo mật thông tin khách hàng Sforum</h1>

        <h3 class="tos-section__subtitle">1. Loại thông tin thu thập</h3>
        <ul class="tos-list">
          <li><strong>Thông tin cá nhân:</strong> Họ tên, số điện thoại, email, địa chỉ giao hàng, số CCCD (đối với một số giao dịch).</li>
          <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thời gian truy cập, cookie để theo dõi sở thích và cải thiện hiệu suất Website.</li>
          <li><strong>Thông tin giao dịch:</strong> Thông tin liên quan đến việc sử dụng dịch vụ và lịch sử trên Sforum.</li>
        </ul>

        <h3 class="tos-section__subtitle">2. Mục đích sử dụng dữ liệu</h3>
        <ul class="tos-list">
          <li>Quản lý tài khoản người dùng và cung cấp dịch vụ trên Sforum.</li>
          <li>Gửi thông báo về hoạt động tài khoản, khuyến mãi và sản phẩm mới (khi có sự đồng ý).</li>
          <li>Hỗ trợ khách hàng, xử lý sự cố và giải quyết khiếu nại.</li>
          <li>Giám sát an ninh, phòng chống gian lận và hoạt động bất hợp pháp.</li>
          <li>Tuân thủ các yêu cầu pháp lý từ cơ quan nhà nước có thẩm quyền.</li>
        </ul>

        <h3 class="tos-section__subtitle">3. Thời gian lưu trữ</h3>
        <p class="tos-section__text">
          Thông tin được lưu trữ cho đến khi người dùng yêu cầu xóa, tài khoản đóng hoặc theo quy định pháp luật.
        </p>

        <h3 class="tos-section__subtitle">4. Đơn vị quản lý dữ liệu</h3>
        <ul class="tos-list">
          <li><strong>Công ty:</strong> Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc.</li>
          <li><strong>Địa chỉ:</strong> 350-352 Võ Văn Kiệt, Phường Cô Giang, Quận 1, TP. Hồ Chí Minh.</li>
          <li><strong>Điện thoại:</strong> 1800.2063.</li>
        </ul>

        <h3 class="tos-section__subtitle">5. Quyền và nghĩa vụ của người dùng</h3>
        <ul class="tos-list">
          <li><strong>Quyền:</strong> Truy cập, chỉnh sửa, xóa hoặc hạn chế xử lý dữ liệu cá nhân. Rút lại sự đồng ý thu thập dữ liệu bất kỳ lúc nào.</li>
          <li><strong>Nghĩa vụ:</strong> Cung cấp thông tin chính xác và chịu trách nhiệm bảo mật thông tin tài khoản (mật khẩu...).</li>
        </ul>

        <h3 class="tos-section__subtitle">6. Biện pháp bảo mật</h3>
        <ul class="tos-list">
          <li>Sforum sử dụng mã hóa (SSL/TLS) và máy chủ bảo mật để bảo vệ dữ liệu người dùng.</li>
          <li>Việc truy cập dữ liệu cá nhân được giới hạn đối với nhân viên được ủy quyền.</li>
        </ul>

        <h3 class="tos-section__subtitle">7. Khiếu nại và thông tin liên hệ</h3>
        <ul class="tos-list">
          <li>Người dùng có thể liên hệ bộ phận hỗ trợ để được giải đáp hoặc thực hiện yêu cầu liên quan đến dữ liệu cá nhân.</li>
          <li><strong>Email:</strong> nhattruong.bui@cellphones.com.vn</li>
          <li><strong>Điện thoại:</strong> 0824111196</li>
          <li>Chính sách có hiệu lực từ ngày <strong>01/01/2024</strong>. Sforum có quyền cập nhật chính sách và sẽ thông báo trên Website.</li>
        </ul>
      </section>

      <!-- VII. Thỏa thuận cung cấp và sử dụng dịch vụ trên Sforum -->
      <section v-if="activeSection === 'sforum'" class="tos-section">
        <h1 class="tos-section__title">VII. Thỏa thuận cung cấp và sử dụng dịch vụ trên Sforum</h1>

        <h3 class="tos-section__subtitle">Điều 1. Định nghĩa</h3>
        <ul class="tos-list">
          <li><strong>Nhà cung cấp</strong>: Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc, hoạt động hợp pháp theo quy định pháp luật Việt Nam.</li>
          <li><strong>Sforum</strong>: Phần của hệ thống trang thông tin điện tử, cung cấp dịch vụ mạng xã hội cho cộng đồng trao đổi, chia sẻ thông tin về công nghệ dưới các hình thức bình luận, chia sẻ bài viết.</li>
          <li><strong>Người sử dụng</strong>: Cá nhân, tổ chức có tài khoản hợp lệ trên Sforum.</li>
          <li><strong>Ban Quản trị</strong>: Bộ phận thuộc Nhà cung cấp, chịu trách nhiệm quản lý hoạt động Sforum và giải quyết vi phạm, khiếu nại.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 2. Đăng ký và ngừng sử dụng dịch vụ</h3>
        <ul class="tos-list">
          <li>Trước khi đăng ký, Người sử dụng xác nhận đã đọc, hiểu và đồng ý với Thỏa thuận này.</li>
          <li>Người sử dụng cam kết cung cấp thông tin chính xác, đầy đủ và trung thực. Vi phạm có thể dẫn đến tạm dừng hoặc chấm dứt cung cấp dịch vụ.</li>
          <li>Người sử dụng tự chịu trách nhiệm bảo mật mật khẩu. Nhà cung cấp không chịu trách nhiệm về thiệt hại phát sinh từ việc không bảo mật mật khẩu.</li>
          <li>Ban quản trị có quyền xóa tài khoản không sử dụng trong thời gian dài hoặc vi phạm nghiêm trọng Thỏa thuận.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 3. Nội dung cấm trao đổi, chia sẻ</h3>
        <ul class="tos-list">
          <li>Chống lại Nhà nước CHXHCN Việt Nam, gây phương hại an ninh quốc gia, trật tự an toàn xã hội.</li>
          <li>Kích động bạo lực, dâm ô, đồi trụy, tội ác, tệ nạn xã hội, mê tín dị đoan.</li>
          <li>Tiết lộ bí mật nhà nước, bí mật quân sự, an ninh, kinh tế, đối ngoại.</li>
          <li>Xuyên tạc, vu khống, xúc phạm uy tín tổ chức, danh dự và nhân phẩm cá nhân.</li>
          <li>Quảng cáo, tuyên truyền mua bán hàng hóa/dịch vụ bị cấm; truyền bá tác phẩm bị cấm.</li>
          <li>Đưa thông tin giả mạo, thông tin sai sự thật gây hoang mang dư luận.</li>
          <li>Vi phạm bản quyền sản phẩm, âm nhạc, video, phim ảnh, phần mềm.</li>
          <li>Nội dung kỳ thị dân tộc, giới tính, tôn giáo, chính trị, chia rẽ vùng miền.</li>
          <li>Các nội dung khác vi phạm pháp luật Việt Nam.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 4. Quyền và nghĩa vụ của Người sử dụng</h3>
        <ul class="tos-list">
          <li><strong>Quyền:</strong> Sử dụng dịch vụ, tính năng của Sforum; được bảo mật thông tin cá nhân; góp ý, phản ánh, khiếu nại.</li>
          <li><strong>Nghĩa vụ:</strong> Tuân thủ Thỏa thuận và pháp luật; cung cấp thông tin chính xác; tự bảo mật tài khoản; chịu trách nhiệm nội dung bài viết, bình luận; không phá hoại hệ thống; không đăng tải nội dung cấm.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 5. Quyền của Nhà cung cấp</h3>
        <ul class="tos-list">
          <li>Thiết lập, thay đổi, nâng cấp, bảo trì hệ thống Sforum bất kỳ lúc nào mà không cần thông báo trước.</li>
          <li>Tạm ngừng hoặc chấm dứt cung cấp dịch vụ trong trường hợp bảo trì, sự cố kỹ thuật hoặc theo yêu cầu cơ quan nhà nước.</li>
          <li>Kiểm duyệt, chỉnh sửa hoặc xóa nội dung vi phạm; sử dụng nội dung người dùng cho mục đích truyền thông, quảng bá.</li>
          <li>Từ chối cung cấp dịch vụ hoặc xóa tài khoản vi phạm Thỏa thuận.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 6. Xử lý vi phạm</h3>
        <ul class="tos-list">
          <li>Xử lý dựa trên Thỏa thuận và pháp luật, đảm bảo công bằng, minh bạch.</li>
          <li>Các biện pháp xử lý: cảnh báo, khóa tài khoản tạm thời hoặc vĩnh viễn, xóa nội dung vi phạm tùy mức độ.</li>
          <li>Thông báo cho người dùng về vi phạm và hình thức xử lý qua email hoặc thông báo trên hệ thống.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 7. Cảnh báo rủi ro</h3>
        <p class="tos-section__text">
          Người sử dụng cần ý thức rằng việc chia sẻ thông tin trên môi trường mạng luôn tiềm ẩn rủi ro về bảo mật. Nhà cung cấp không chịu trách nhiệm về rủi ro phát sinh từ việc người dùng tự ý chia sẻ thông tin cá nhân. Người dùng nên cân nhắc kỹ trước khi đăng tải thông tin quan trọng hoặc mang tính riêng tư.
        </p>

        <h3 class="tos-section__subtitle">Điều 8. Giải quyết khiếu nại, tranh chấp</h3>
        <ul class="tos-list">
          <li>Mọi khiếu nại được giải quyết trên tinh thần hợp tác và thỏa thuận giữa các bên.</li>
          <li>Trường hợp không thỏa thuận được, các bên có quyền đưa ra cơ quan nhà nước có thẩm quyền.</li>
          <li><strong>Hotline:</strong> 1800.2097 &nbsp;&nbsp; <strong>Email:</strong> cskh@cellphones.com.vn</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 9. Miễn trừ trách nhiệm pháp lý</h3>
        <ul class="tos-list">
          <li>Nhà cung cấp không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ việc sử dụng dịch vụ.</li>
          <li>Nhà cung cấp không chịu trách nhiệm về tính chính xác, tính đầy đủ của thông tin do người dùng đăng tải.</li>
        </ul>

        <h3 class="tos-section__subtitle">Điều 10. Sửa đổi Thỏa thuận</h3>
        <p class="tos-section__text">
          Nhà cung cấp có quyền sửa đổi, bổ sung Thỏa thuận này bất kỳ lúc nào. Các thay đổi có hiệu lực kể từ thời điểm được đăng tải trên Sforum. Người dùng tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc chấp nhận các điều khoản mới.
        </p>

        <div class="tos-hotline">
          <div class="tos-hotline__item">
            <span class="tos-hotline__label">Gọi mua hàng</span>
            <span class="tos-hotline__value">1800.2097 (8h00 – 22h00)</span>
          </div>
          <div class="tos-hotline__item">
            <span class="tos-hotline__label">Gọi khiếu nại</span>
            <span class="tos-hotline__value">1800.2063 (8h00 – 21h30)</span>
          </div>
          <div class="tos-hotline__item tos-hotline__item--last">
            <span class="tos-hotline__label">Gọi bảo hành</span>
            <span class="tos-hotline__value">1800.2064 (8h00 – 21h00)</span>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'profile' })

useHead({ title: 'Quy chế hoạt động - IrusGear' })

const activeSection = ref('general')

const sidebarItems = [
  { key: 'general', label: 'I. Quy định chung' },
  { key: 'transaction', label: 'II. Quy trình giao dịch' },
  { key: 'warranty', label: 'III. Chính sách bảo hành sản phẩm' },
  { key: 'cancellation', label: 'IV. Chính sách hủy đơn, đổi trả' },
  { key: 'privacy-cellphones', label: 'V. Bảo mật thông tin Cellphones' },
  { key: 'privacy-sforum', label: 'VI. Bảo mật thông tin Sforum' },
  { key: 'sforum', label: 'VII. Thỏa thuận Sforum' },
]
</script>

<style scoped>
/* ── Layout ──────────────────────────────── */
.tos-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ─────────────────────────────── */
.tos-sidebar {
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

.tos-sidebar::-webkit-scrollbar { width: 4px; }
.tos-sidebar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 999px; }

.tos-sidebar__section {
  padding: 8px 0;
}

.tos-sidebar__title {
  padding: 12px 20px 6px;
  font-size: 11px;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tos-sidebar__item {
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

.tos-sidebar__item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.tos-sidebar__item--active {
  background: #fef2f2;
  color: #d70018;
  font-weight: 600;
  border-left-color: #d70018;
}

.tos-sidebar__item--active:hover {
  background: #fef2f2;
  color: #d70018;
}

/* ── Content ──────────────────────────────── */
.tos-content {
  flex: 1;
  min-width: 0;
}

/* ── Section ─────────────────────────────── */
.tos-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 28px 28px 32px;
}

.tos-section__title {
  font-size: 20px;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 20px;
  line-height: 1.3;
}

.tos-section__subtitle {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 24px 0 12px;
}

.tos-section__subtitle:first-of-type {
  margin-top: 0;
}

.tos-section__text {
  font-size: 14px;
  color: #3f3f46;
  margin: 0;
  line-height: 1.7;
}

/* ── Lists ───────────────────────────────── */
.tos-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tos-list li {
  font-size: 14px;
  color: #3f3f46;
  line-height: 1.7;
}

.tos-list li strong {
  color: #18181b;
}

/* ── Table ───────────────────────────────── */
.tos-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  margin-top: 4px;
}

.tos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tos-table thead tr {
  background: #f4f4f5;
}

.tos-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  color: #18181b;
  font-size: 13px;
  border-bottom: 1px solid #e4e4e7;
  white-space: nowrap;
}

.tos-table td {
  padding: 12px 16px;
  color: #3f3f46;
  line-height: 1.5;
  border-bottom: 1px solid #f4f4f5;
  vertical-align: top;
}

.tos-table tbody tr:last-child td {
  border-bottom: none;
}

.tos-table tbody tr:hover td {
  background: #fafafa;
}

.tos-table td strong {
  color: #18181b;
}

/* ── Notice ──────────────────────────────── */
.tos-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  margin-top: 20px;
}

.tos-notice svg {
  color: #71717a;
  flex-shrink: 0;
  margin-top: 2px;
}

.tos-notice div {
  font-size: 13px;
  color: #52525b;
  line-height: 1.6;
}

.tos-notice strong {
  color: #18181b;
}

/* ── Hotline ─────────────────────────────── */
.tos-hotline {
  margin-top: 28px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  overflow: hidden;
}

.tos-hotline__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f4f4f5;
  gap: 16px;
}

.tos-hotline__item--last {
  border-bottom: none;
}

.tos-hotline__label {
  font-size: 13px;
  font-weight: 600;
  color: #18181b;
  flex-shrink: 0;
}

.tos-hotline__value {
  font-size: 13px;
  color: #52525b;
  text-align: right;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 991.98px) {
  .tos-layout {
    flex-direction: column;
  }

  .tos-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
  }

  .tos-sidebar__section {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
  }

  .tos-sidebar__title {
    width: 100%;
    padding: 4px 8px;
    font-size: 10px;
  }

  .tos-sidebar__item {
    padding: 8px 12px;
    font-size: 12px;
    border-left: none;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    background: #fff;
    white-space: nowrap;
  }

  .tos-sidebar__item--active {
    background: #d70018;
    color: #fff;
    border-color: #d70018;
  }

  .tos-sidebar__item--active:hover {
    background: #b80015;
    color: #fff;
  }

  .tos-section {
    padding: 20px 16px 24px;
    border-radius: 14px;
  }

  .tos-section__title {
    font-size: 18px;
  }

  .tos-section__subtitle {
    font-size: 14px;
  }

  .tos-table th,
  .tos-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
}

@media (max-width: 575.98px) {
  .tos-sidebar__item {
    font-size: 11px;
    padding: 6px 10px;
  }

  .tos-section {
    padding: 16px 12px 20px;
  }
}

@media (min-width: 1200px) {
  .tos-sidebar {
    width: 300px;
  }

  .tos-section {
    padding: 32px 36px 36px;
  }

  .tos-section__title {
    font-size: 22px;
  }
}
</style>
