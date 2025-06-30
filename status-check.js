// 快速状态检查
console.log('🔍 检查服务状态...\n');

// 检查前端
fetch('http://localhost:5173')
  .then(response => {
    if (response.ok) {
      console.log('✅ 前端服务正常 - http://localhost:5173');
    } else {
      console.log('❌ 前端服务异常');
    }
  })
  .catch(() => {
    console.log('❌ 前端服务未启动');
  });

// 检查后端
fetch('http://localhost:3001/api/stats')
  .then(response => response.json())
  .then(data => {
    console.log('✅ 后端服务正常 - http://localhost:3001');
    console.log('📊 统计数据:', data);
  })
  .catch(() => {
    console.log('❌ 后端服务未启动或异常');
  });

setTimeout(() => {
  console.log('\n🎯 如果服务都正常，请访问: http://localhost:5173');
}, 1000);
