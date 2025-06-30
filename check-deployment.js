// 部署前检查脚本
import fs from 'fs';
import path from 'path';

console.log('🔍 检查部署准备情况...\n');

const checks = [
  {
    name: '检查 package.json',
    check: () => fs.existsSync('package.json'),
    fix: '确保 package.json 文件存在'
  },
  {
    name: '检查 vercel.json',
    check: () => fs.existsSync('vercel.json'),
    fix: '确保 vercel.json 配置文件存在'
  },
  {
    name: '检查 API 文件',
    check: () => {
      const apiFiles = [
        'api/stats.js',
        'api/works.js',
        'api/works/[id].js',
        'api/works/[id]/like.js'
      ];
      return apiFiles.every(file => fs.existsSync(file));
    },
    fix: '确保所有 API 文件都存在'
  },
  {
    name: '检查构建脚本',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.build;
    },
    fix: '确保 package.json 中有 build 脚本'
  },
  {
    name: '检查依赖',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.dependencies && pkg.dependencies.vue && pkg.dependencies.uuid;
    },
    fix: '运行 npm install 安装依赖'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 建议: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 所有检查通过！项目已准备好部署。');
  console.log('\n📋 部署步骤:');
  console.log('1. npm install');
  console.log('2. npm run build');
  console.log('3. npx vercel --prod');
} else {
  console.log('⚠️  请修复上述问题后再进行部署。');
}

console.log('\n📖 详细部署指南: QUICK-DEPLOY.md');
console.log('🔧 完整说明文档: DEPLOYMENT-GUIDE.md');
