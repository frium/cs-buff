const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const COOKIE = '_ntes_nnid=d94a365ecce6145860af2adcb27b102b,1748007616197; _ntes_nuid=d94a365ecce6145860af2adcb27b102b; P_INFO="m15989375030@163.com|1748954885|0|unireg|00&99|null&null&null#gud&440800#10#0#0|159030&1||15989375030@163.com"; hb_MA-9ADA-91BF1A6C9E06_source=leihuo.163.com; Device-Id=46xi8j0k5ja75vflsvJv; Locale-Supported=zh-Hans; qr_code_verify_ticket=7fcxaNZ60c889a75300edeb4782be105cf35; session=1-acA3P25DwUTx2QJZIDA68-yMG7ZdTbeUVObt2Ashsrzg2031028736; EPAY_SSID=522FE5269702BE80C9931490DB22E39E2307A2CCBB9EFC3F5F5F1C3A58C32869; EPAY_CrosId=522FE5269702BE80C9931490DB22E39E2307A2CCBB9EFC3F5F5F1C3A58C32869; timing_user_id=time_vD1nWyO1WL; _ga=GA1.1.1816414330.1774612188; Qs_lvt_382223=1774612188; Qs_pv_382223=2457384228959763500; _clck=1ex5ef6%5E2%5Eg4p%5E0%5E2277; _ga_C6TGHFPQ1H=GS2.1.s1774612188$o1$g0$t1774612189$j59$l0$h0; game=csgo; csrf_token=ImNmY2U2NDRiN2IwMGQ5NjNmMDY4NDA4NTdjZGQ4NmM4YmM0YTdlODci.acZ1-w.2WOpgXbQ5I7p17eFuS5_LNnmKJE';

// 代理接口：前端请求此接口，服务端用 axios 转发到 BUFF163
app.get('/api/buff', async (req, res) => {
  try {
    const { page_num, min_price, max_price, category_group } = req.query;

    const params = {
      game: 'csgo',
      page_num: page_num || 1,
      min_price: min_price || 1,
      max_price: max_price || 1000,
      sort_by: 'sell_num.desc',
      tab: 'selling'
    };

    if (category_group) {
      params.category_group = category_group;
    }

    const result = await axios.get('https://buff.163.com/api/market/goods', {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://buff.163.com/market/csgo',
        'Cookie': COOKIE
      }
    });

    res.json(result.data);
  } catch (err) {
    console.error('请求BUFF163失败:', err.message);
    if (err.response) {
      res.status(err.response.status).json({ code: 'ERROR', error: `HTTP ${err.response.status}` });
    } else {
      res.status(500).json({ code: 'ERROR', error: err.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`服务已启动: http://localhost:${PORT}`);
});
