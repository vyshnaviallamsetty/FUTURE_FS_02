// ============================================
// NEXUS CRM PRO - Application Script
// ============================================

// ============================================
// 1. AUTHENTICATION & SESSION MANAGEMENT
// ============================================

function checkAuthenticationStatus() {
    const isAuthenticated = sessionStorage.getItem('nexus_admin_auth');
    if (!isAuthenticated && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// Sign out functionality
document.addEventListener('DOMContentLoaded', () => {
    const signoutBtn = document.getElementById('system-signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('nexus_admin_auth');
            window.location.href = 'index.html';
        });
    }
    checkAuthenticationStatus();
});

// ============================================
// 2. DATA MANAGEMENT
// ============================================

function initializeDatabase() {
    const existingDb = localStorage.getItem('nexus_pro_database');
    if (!existingDb) {
        const defaultData = [
            {
                id: 'CRM-0001',
                name: 'Sarah Johnson',
                company: 'TechVision Inc',
                email: 'sarah.johnson@techvision.com',
                value: 150000,
                source: 'LinkedIn Outbound',
                status: 'Contacted',
                dateAdded: '2024-01-15',
                notes: 'Interested in enterprise solution, scheduled demo'
            },
            {
                id: 'CRM-0002',
                name: 'Michael Chen',
                company: 'Digital Dynamics LLC',
                email: 'mchen@digitaldynamics.com',
                value: 75000,
                source: 'Organic Inbound Engine',
                status: 'New',
                dateAdded: '2024-02-18',
                notes: 'Inbound inquiry via website'
            },
            {
                id: 'CRM-0003',
                name: 'Emma Rodriguez',
                company: 'CloudFirst Solutions',
                email: 'emma.r@cloudfirst.io',
                value: 250000,
                source: 'Executive Referral Grid',
                status: 'Converted',
                dateAdded: '2024-02-10',
                notes: 'Signed contract, onboarding in progress'
            },
            {
    id: 'CRM-0004',
    name: 'David Williams',
    company: 'NextGen Technologies',
    email: 'david.williams@nextgentech.com',
    value: 120000,
    source: 'Direct Outreach',
    status: 'Converted',
    dateAdded: '2024-03-20',
    notes: 'Requested pricing details and product demo'
},
{
    id: 'NX-2026-125',
    name: 'Olivia Martinez',
    company: 'BrightWave Solutions',
    email: 'olivia@brightwave.com',
    value: 95000,
    source: 'Paid Campaign',
    status: 'Contacted',
    dateAdded: '2024-05-22',
    notes: 'Follow-up call scheduled for next week'
},
{
    id: 'CRM-0006',
    name: 'James Anderson',
    company: 'Vertex Systems',
    email: 'j.anderson@vertexsystems.com',
    value: 210000,
    source: 'Linkedin Outbound',
    status: 'Converted',
    dateAdded: '2024-06-12',
    notes: 'Contract signed, implementation starts next month'
},
{
    id: 'NX-2926-857',
    name: 'Sophia Brown',
    company: 'InnovateX Labs',
    email: 'sophia.brown@innovatexlabs.com',
    value: 65000,
    source: 'Paid Campaign',
    status: 'New',
    dateAdded: '2024-07-25',
    notes: 'Downloaded product brochure and requested callback'
},
{
    id: 'CRM-0008',
    name: 'Daniel Wilson',
    company: 'PrimeEdge Consulting',
    email: 'daniel.wilson@primeedge.com',
    value: 180000,
    source: 'Executive Referral Grid',
    status: 'Contacted',
    dateAdded: '2024-09-17',
    notes: 'Interested in annual subscription, proposal sent'
}
        ];
        localStorage.setItem('nexus_pro_database', JSON.stringify(defaultData));
    }
}

function getDatabase() {
    try {
        return JSON.parse(localStorage.getItem('nexus_pro_database')) || [];
    } catch (err) {
        console.error('Error reading database:', err);
        return [];
    }
}

function saveDatabase(data) {
    try {
        localStorage.setItem('nexus_pro_database', JSON.stringify(data));
        return true;
    } catch (err) {
        console.error('Error saving database:', err);
        return false;
    }
}

// ============================================
// 3. PIPELINE VIEW AUTHENTICATION
// ============================================

function setupPipelineAuth() {
    const authModal = document.getElementById('pipeline-auth-modal');
    const gateForm = document.getElementById('pipeline-gate-form');
    const cancelBtn = document.getElementById('cancel-pipeline-auth');
    const errorMsg = document.getElementById('pipeline-auth-error');

    if (gateForm) {
        gateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const passInput = document.getElementById('pipeline-gate-pass').value;
            
            if (passInput === 'admin123') {
                sessionStorage.setItem('pipeline_access_granted', 'true');
                if (authModal) {
                    authModal.classList.add('hidden');
                }
                if (errorMsg) errorMsg.style.display = 'none';
                document.getElementById('pipeline-gate-pass').value = '';
                switchView('pipeline-view');
            } else {
                if (errorMsg) errorMsg.style.display = 'block';
                document.getElementById('pipeline-gate-pass').value = '';
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (authModal) {
                authModal.classList.add('hidden');
            }
            if (errorMsg) errorMsg.style.display = 'none';
            document.getElementById('pipeline-gate-pass').value = '';
        });
    }
}

// ============================================
// 4. VIEW NAVIGATION
// ============================================

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const viewName = item.getAttribute('data-view');
            if (viewName) {
                e.preventDefault();
                
                // Check if pipeline view and not yet unlocked
                if (viewName === 'pipeline-view') {
                    const pipelineUnlocked = sessionStorage.getItem('pipeline_access_granted');
                    if (!pipelineUnlocked) {
                        const authModal = document.getElementById('pipeline-auth-modal');
                        if (authModal) {
                            authModal.classList.remove('hidden');
                        }
                        return;
                    }
                }
                
                switchView(viewName);
            }
        });
    });
}

function switchView(viewName) {
    const allViews = document.querySelectorAll('.workspace-view');
    const allMenuItems = document.querySelectorAll('.menu-item');
    
    allViews.forEach(view => {
        view.classList.add('hidden');
    });
    
    allMenuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
    
    const activeMenuItem = document.querySelector(`[data-view="${viewName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }

    if (viewName === 'pipeline-view') {
        setTimeout(() => {
            loadPipelineData();
        }, 100);
    }

    if (viewName === 'analytics-view') {
        setTimeout(() => {
            updateAnalytics();
        }, 100);
    }
}

// ============================================
// 5. KPI DASHBOARD
// ============================================

function updateDashboard() {
    const db = getDatabase();
    const totalLeads = db.length;
    const totalPipelineWorth = db.reduce((sum, lead) => sum + (lead.value || 0), 0);
    
    const kpiLeads = document.getElementById('kpi-total-leads');
    const kpiWorth = document.getElementById('kpi-pipeline-worth');
    
    if (kpiLeads) kpiLeads.textContent = totalLeads;
    if (kpiWorth) kpiWorth.textContent = '$' + totalPipelineWorth.toLocaleString();
    
    updatePipelineChart();
}

function updatePipelineChart() {
    const chartCanvas = document.getElementById('pipelineStatusChart');
    if (!chartCanvas) return;

    const db = getDatabase();
    const statusCounts = {
        'New': 0,
        'Contacted': 0,
        'Converted': 0
    };
    
    db.forEach(lead => {
        if (statusCounts.hasOwnProperty(lead.status)) {
            statusCounts[lead.status]++;
        }
    });

    const ctx = chartCanvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.pipelineChart) {
        window.pipelineChart.destroy();
    }

    window.pipelineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['New', 'Contacted', 'Converted'],
            datasets: [{
                label: 'Pipeline Status Distribution',
                data: [statusCounts['New'], statusCounts['Contacted'], statusCounts['Converted']],
                backgroundColor: ['#f1f5f9', '#3b82f6', '#10b981'],
                borderColor: ['#cbd5e1', '#2563eb', '#059669'],
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#475569',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(statusCounts['New'], statusCounts['Contacted'], statusCounts['Converted']) + 1,
                    ticks: {
                        color: '#64748b',
                        stepSize: 1
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                },
                x: {
                    ticks: {
                        color: '#64748b'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ============================================
// 6. PIPELINE DATA TABLE
// ============================================

let currentSelectedLeadId = null;

function loadPipelineData() {
    const db = getDatabase();
    const tbody = document.getElementById('pipeline-grid-tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    db.forEach(lead => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.innerHTML = `
            <td>${lead.id}</td>
            <td>${lead.name}</td>
            <td>${lead.company}</td>
        `;
        
        row.addEventListener('click', () => {
            displayLeadDetails(lead);
        });
        
        tbody.appendChild(row);
    });
}

function displayLeadDetails(lead) {
    const detailsPanel = document.getElementById('lead-details-panel');
    
    if (!detailsPanel) return;
    
    currentSelectedLeadId = lead.id;
    
    // Update all detail fields
    document.getElementById('detail-id').textContent = lead.id || '-';
    document.getElementById('detail-name').textContent = lead.name || '-';
    document.getElementById('detail-company').textContent = lead.company || '-';
    document.getElementById('detail-email').textContent = lead.email || '-';
    document.getElementById('detail-value').textContent = lead.value ? '$' + lead.value.toLocaleString() : '-';
    document.getElementById('detail-source').textContent = lead.source || '-';
    document.getElementById('detail-status').textContent = lead.status || '-';
    document.getElementById('detail-date').textContent = lead.dateAdded || '-';
    document.getElementById('detail-notes').textContent = lead.notes || 'No notes available';
    
    // Show the details panel
    detailsPanel.style.display = 'block';
    
    // Scroll details panel to top
    detailsPanel.scrollTop = 0;
}

function setupPipelineSearch() {
    const searchInput = document.getElementById('pipeline-search');
    const tbody = document.getElementById('pipeline-grid-tbody');
    
    if (!searchInput || !tbody) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

function setupCSVExport() {
    const exportBtn = document.getElementById('export-csv-btn');
    
    if (!exportBtn) return;
    
    exportBtn.addEventListener('click', () => {
        const db = getDatabase();
        const headers = ['ID', 'Name', 'Company', 'Email', 'Value', 'Source', 'Status', 'Date Added'];
        const rows = db.map(lead => [
            lead.id,
            lead.name,
            lead.company,
            lead.email,
            lead.value,
            lead.source,
            lead.status,
            lead.dateAdded
        ]);
        
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nexus_crm_export_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

// ============================================
// 7. EDIT LEAD
// ============================================

function setupEditLead() {
    const editBtn = document.getElementById('edit-lead-btn');
    const closeEditBtn = document.getElementById('close-edit-modal-btn');
    const editModal = document.getElementById('edit-lead-modal');
    const editForm = document.getElementById('nexus-edit-form');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (!currentSelectedLeadId) return;
            
            const db = getDatabase();
            const lead = db.find(l => l.id === currentSelectedLeadId);
            
            if (!lead) return;
            
            // Populate edit form with current lead data
            document.getElementById('edit-input-name').value = lead.name || '';
            document.getElementById('edit-input-company').value = lead.company || '';
            document.getElementById('edit-input-email').value = lead.email || '';
            document.getElementById('edit-input-value').value = lead.value || '';
            document.getElementById('edit-input-source').value = lead.source || '';
            document.getElementById('edit-input-status').value = lead.status || '';
            document.getElementById('edit-input-close-date').value = lead.dateAdded || '';
            document.getElementById('edit-input-notes').value = lead.notes || '';
            
            // Show modal
            if (editModal) editModal.classList.remove('hidden');
        });
    }
    
    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', () => {
            if (editModal) editModal.classList.add('hidden');
            if (editForm) editForm.reset();
        });
    }
    
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.classList.add('hidden');
                if (editForm) editForm.reset();
            }
        });
    }
    
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const db = getDatabase();
            const leadIndex = db.findIndex(l => l.id === currentSelectedLeadId);
            
            if (leadIndex === -1) return;
            
            // Update lead data
            db[leadIndex].name = document.getElementById('edit-input-name').value.trim();
            db[leadIndex].company = document.getElementById('edit-input-company').value.trim();
            db[leadIndex].email = document.getElementById('edit-input-email').value.trim();
            db[leadIndex].value = parseFloat(document.getElementById('edit-input-value').value) || 0;
            db[leadIndex].source = document.getElementById('edit-input-source').value;
            db[leadIndex].status = document.getElementById('edit-input-status').value;
            db[leadIndex].dateAdded = document.getElementById('edit-input-close-date').value;
            db[leadIndex].notes = document.getElementById('edit-input-notes').value.trim();
            
            saveDatabase(db);
            
            if (editModal) editModal.classList.add('hidden');
            if (editForm) editForm.reset();
            
            // Refresh pipeline data and details
            loadPipelineData();
            displayLeadDetails(db[leadIndex]);
            updateDashboard();
        });
    }
}

// ============================================
// 8. DELETE LEAD
// ============================================

function setupDeleteLead() {
    const deleteBtn = document.getElementById('delete-lead-btn');
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (!currentSelectedLeadId) return;
            
            if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
                const db = getDatabase();
                const filteredDb = db.filter(l => l.id !== currentSelectedLeadId);
                
                saveDatabase(filteredDb);
                
                currentSelectedLeadId = null;
                const detailsPanel = document.getElementById('lead-details-panel');
                if (detailsPanel) detailsPanel.style.display = 'none';
                
                // Refresh pipeline data and dashboard
                loadPipelineData();
                updateDashboard();
            }
        });
    }
}

// ============================================
// 9. MODAL MANAGEMENT
// ============================================

function setupIngestModal() {
    const modal = document.getElementById('ingest-modal');
    const openBtn = document.getElementById('open-ingest-modal-btn');
    const closeBtn = document.getElementById('close-ingest-modal-btn');
    const form = document.getElementById('nexus-ingestion-form');
    
    if (!modal || !openBtn) return;
    
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            form.reset();
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            form.reset();
        }
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const db = getDatabase();
            const newLead = {
                id: `CRM-${String(db.length + 1).padStart(4, '0')}`,
                name: document.getElementById('input-name').value.trim(),
                company: document.getElementById('input-company').value.trim(),
                email: document.getElementById('input-email').value.trim(),
                value: parseFloat(document.getElementById('input-value').value) || 0,
                source: document.getElementById('input-source').value,
                status: document.getElementById('input-status').value,
                dateAdded: document.getElementById('input-close-date').value || new Date().toISOString().split('T')[0],
                notes: document.getElementById('input-notes').value.trim()
            };
            
            db.push(newLead);
            saveDatabase(db);
            
            form.reset();
            modal.classList.add('hidden');
            updateDashboard();
            loadPipelineData();
        });
    }
}

// ============================================
// 10. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize database with default data if empty
    initializeDatabase();
    
    // Setup navigation
    setupNavigation();
    
    // Setup pipeline authentication
    setupPipelineAuth();
    
    // Update dashboard
    updateDashboard();
    
    // Setup modal
    setupIngestModal();
    
    // Setup pipeline features
    setupPipelineSearch();
    setupCSVExport();
    
    // Setup edit and delete
    setupEditLead();
    setupDeleteLead();
    
    // Load pipeline data if on that view
    const pipelineView = document.getElementById('pipeline-view');
    if (pipelineView && !pipelineView.classList.contains('hidden')) {
        loadPipelineData();
    }
});

// ============================================
// ANALYTICS VIEW
// ============================================

const _anCharts = {};

function _destroyChart(id) {
    if (_anCharts[id]) {
        _anCharts[id].destroy();
        delete _anCharts[id];
    }
}

function updateAnalytics() {
    // Always re-read fresh from localStorage
    initializeDatabase();
    const db = getDatabase();

    if (!db || db.length === 0) {
        // Show empty state in all KPI cards
        ['an-conversion-rate', 'an-avg-value', 'an-top-source', 'an-converted-revenue'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = id === 'an-top-source' ? '—' : '0';
        });
        const tbody = document.getElementById('source-breakdown-tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;padding:2rem;">No lead data found. Add leads via the pipeline.</td></tr>';
        return;
    }

    // ── KPI calculations ──────────────────────────────────────────
    const total = db.length;
    const converted = db.filter(l => l.status === 'Converted');
    const convRate = ((converted.length / total) * 100).toFixed(1);
    const totalValue = db.reduce((s, l) => s + (Number(l.value) || 0), 0);
    const avgValue = Math.round(totalValue / total);
    const convertedRevenue = converted.reduce((s, l) => s + (Number(l.value) || 0), 0);

    const sourceCounts = {};
    db.forEach(l => {
        const src = l.source || 'Unknown';
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];

    // ── Write KPI cards ───────────────────────────────────────────
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('an-conversion-rate', convRate + '%');
    set('an-avg-value', '$' + avgValue.toLocaleString());
    set('an-top-source', topSource ? topSource[0] : '—');
    set('an-converted-revenue', '$' + convertedRevenue.toLocaleString());

    // ── Shared palette ────────────────────────────────────────────
    const PAL = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];
    const sources = Object.keys(sourceCounts);

    // ── Chart helpers ─────────────────────────────────────────────
    const axisStyle = {
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { color: '#e2e8f0' }
    };
    const noGridX = { ticks: { color: '#64748b', font: { size: 11 } }, grid: { display: false } };

    // ── Chart 1: Revenue by Pipeline Stage (vertical bar) ─────────
    const stages = ['New', 'Contacted', 'Converted'];
    const stageRevenue = stages.map(s =>
        db.filter(l => l.status === s).reduce((sum, l) => sum + (Number(l.value) || 0), 0)
    );
    _destroyChart('revenueByStageChart');
    _anCharts['revenueByStageChart'] = new Chart(document.getElementById('revenueByStageChart'), {
        type: 'bar',
        data: {
            labels: stages,
            datasets: [{
                data: stageRevenue,
                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { ...axisStyle, beginAtZero: true, ticks: { ...axisStyle.ticks, callback: v => '$' + v.toLocaleString() } },
                x: noGridX
            }
        }
    });

    // ── Chart 2: Lead Volume by Source (doughnut) ─────────────────
    _destroyChart('leadsBySourceChart');
    _anCharts['leadsBySourceChart'] = new Chart(document.getElementById('leadsBySourceChart'), {
        type: 'doughnut',
        data: {
            labels: sources,
            datasets: [{
                data: sources.map(s => sourceCounts[s]),
                backgroundColor: PAL,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#475569', font: { size: 11 }, padding: 10, boxWidth: 12 }
                }
            }
        }
    });

    // ── Chart 3: Monthly Lead Acquisition Trend (line) ────────────
    const monthMap = {};
    db.forEach(l => {
        if (!l.dateAdded) return;
        const key = l.dateAdded.substring(0, 7);
        monthMap[key] = (monthMap[key] || 0) + 1;
    });
    const sortedMonths = Object.keys(monthMap).sort();
    const monthLabels = sortedMonths.map(m => {
        const [yr, mo] = m.split('-');
        return new Date(yr, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
    });

    _destroyChart('monthlyTrendChart');
    _anCharts['monthlyTrendChart'] = new Chart(document.getElementById('monthlyTrendChart'), {
        type: 'line',
        data: {
            labels: monthLabels.length ? monthLabels : ['No data'],
            datasets: [{
                label: 'Leads Added',
                data: sortedMonths.map(m => monthMap[m]),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderWidth: 2,
                pointBackgroundColor: '#3b82f6',
                pointRadius: 4,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { ...axisStyle, beginAtZero: true, ticks: { ...axisStyle.ticks, stepSize: 1 } },
                x: noGridX
            }
        }
    });

    // ── Chart 4: Revenue by Source (horizontal bar) ───────────────
    const srcRevenue = sources.map(s =>
        db.filter(l => (l.source || 'Unknown') === s).reduce((sum, l) => sum + (Number(l.value) || 0), 0)
    );
    _destroyChart('revenueBySourceChart');
    _anCharts['revenueBySourceChart'] = new Chart(document.getElementById('revenueBySourceChart'), {
        type: 'bar',
        data: {
            labels: sources,
            datasets: [{
                data: srcRevenue,
                backgroundColor: PAL,
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ...axisStyle, beginAtZero: true, ticks: { ...axisStyle.ticks, callback: v => '$' + v.toLocaleString() } },
                y: noGridX
            }
        }
    });

    // ── Source Breakdown Table ────────────────────────────────────
    const tbody = document.getElementById('source-breakdown-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    sources.forEach((src, i) => {
        const srcLeads = db.filter(l => (l.source || 'Unknown') === src);
        const srcConverted = srcLeads.filter(l => l.status === 'Converted');
        const rate = srcLeads.length > 0 ? ((srcConverted.length / srcLeads.length) * 100).toFixed(1) : '0.0';
        const srcTotal = srcLeads.reduce((s, l) => s + (Number(l.value) || 0), 0);
        const srcAvg = srcLeads.length > 0 ? Math.round(srcTotal / srcLeads.length) : 0;
        const color = PAL[i % PAL.length];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle;"></span><strong>${src}</strong></td>
            <td>${srcLeads.length}</td>
            <td>${srcConverted.length}</td>
            <td>
                <span style="font-weight:600;">${rate}%</span>
                <div class="conversion-bar-bg">
                    <div class="conversion-bar-fill" style="width:${rate}%;background:${color};"></div>
                </div>
            </td>
            <td style="color:#10b981;font-weight:600;">$${srcTotal.toLocaleString()}</td>
            <td>$${srcAvg.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}