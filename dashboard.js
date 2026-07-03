document.addEventListener("DOMContentLoaded", () => {
  // Supabase config
  const SUPABASE_URL = "https://mvjxloioivrwilvctuck.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12anhsb2lvaXZyd2lsdmN0dWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMzA5MTksImV4cCI6MjA5ODYwNjkxOX0.pulCaHi1cAh4EmQt7cIN3eKdsKJ0MQxJx_Kzht6Zcb8";
  
  if (!window.supabaseClient) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  const supabaseClient = window.supabaseClient;

  // AUTH CHECK
  (async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session || !session.user) {
      window.location.href = 'loggin.html';
    }
  })();

  // CURRENT VIEW STATE
  let currentTable = 'contact_submissions';

  function setActiveTab(activeBtn) {
    const tourBtn = document.getElementById('tour-requests-btn');
    const vipBtn = document.getElementById('vip-program-btn');

    [tourBtn, vipBtn].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('tab-active');
    });

    if (activeBtn) {
      activeBtn.classList.add('tab-active');
    }
  }

  // LOAD TABLE DATA (TOUR + VIP)
  async function loadTable(table) {
    currentTable = table;

    const { data, error } = await supabaseClient
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch:', error);
      return;
    }

    const container = document.getElementById('messages');
    if (!container) return;

    container.innerHTML = '';

    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'bg-white border rounded p-4 mb-4';

      let name = '';
      let email = item.email || '';
      let phone = item.phone ? ` • ${item.phone}` : '';
      let message = item.message || '';
      let child = '';
      let roles = '';

      // CONTACT SUBMISSIONS
      if (table === 'contact_submissions') {
        name = `${item.first_name || ''} ${item.last_name || ''}`;
      }

      // VIP REQUESTS
      if (table === 'vip_volunteer_submissions') {
        name = `${item.parent_first || ''} ${item.parent_last || ''}`;
        child = `${item.student_first || ''} ${item.student_last || ''}`.trim();
        roles = Array.isArray(item.roles) ? item.roles.join(', ') : '';
      }
      

      div.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <strong>${name}</strong>
            <p class="text-sm text-gray-600">${email}${phone}</p>
            ${table === 'vip_volunteer_submissions' ? `
              <p class="text-sm text-[#532782]">Child: ${child}</p>
              <p class="text-sm text-gray-600">Roles: ${roles}</p>
            ` : ''}
            <p class="mt-2 text-gray-800 whitespace-pre-wrap">${message}</p>
          </div>

          <div class="text-xs text-gray-400">
            ${item.created_at ? new Date(item.created_at).toLocaleString() : ''}
          </div>
        </div>
      `;

      container.appendChild(div);
    });
  }

  // BUTTONS
  const tourBtn = document.getElementById('tour-requests-btn');
  const vipBtn = document.getElementById('vip-program-btn');

  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      loadTable('contact_submissions');
      setActiveTab(tourBtn);
    });
  }

  if (vipBtn) {
    vipBtn.addEventListener('click', () => {
      loadTable('vip_volunteer_submissions');
      setActiveTab(vipBtn);
    });
  }

  // REFRESH
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadTable(currentTable);

      const tourBtn = document.getElementById('tour-requests-btn');
      const vipBtn = document.getElementById('vip-program-btn');

      if (currentTable === 'contact_submissions') {
        setActiveTab(tourBtn);
      } else {
        setActiveTab(vipBtn);
      }
    });
  }

  // LOGOUT
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      window.location.href = 'loggin.html';
    });
  }
  // INITIAL LOAD
  loadTable('contact_submissions');
  setActiveTab(document.getElementById('tour-requests-btn'));
});