<#
.SYNOPSIS
Go 项目架构守卫脚本，用于强制校验代码规范与架构约束。

.DESCRIPTION
自动扫描项目 Go 源码，检查并禁止不符合架构设计的代码模式：
- 禁止 api/service/repository 直接 import appctx
- 禁止使用 Service Locator 模式（MustFromGin/DepsFromGin/mustApp）
- 禁止使用 global.* 全局变量
- 禁止调用 runtime 配置包级单例（site_service.GetRuntime*）
- 禁止 service 层依赖 gin Web 框架

.EXAMPLE
./arch-guard.ps1
执行架构检查，违规则抛出错误并终止执行。

.NOTES
通常用于 pre-commit 或 CI/CD 流水线，确保代码提交前符合架构规范。
#>

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$apiRoot = Join-Path $repoRoot "apps/api"

function Get-GoFiles {
    param(
        [string]$Root
    )
    Get-ChildItem -Path $Root -Recurse -File -Filter "*.go" |
        Where-Object { $_.Name -notlike "*_test.go" }
}

function Assert-NoMatch {
    param(
        [string]$RuleName,
        [string]$Root,
        [string]$Pattern
    )

    $violations = @()
    foreach ($file in (Get-GoFiles -Root $Root)) {
        if (Select-String -Path $file.FullName -Pattern $Pattern -Quiet) {
            $violations += $file.FullName
        }
    }

    if ($violations.Count -gt 0) {
        Write-Host "[$RuleName] 检测失败：" -ForegroundColor Red
        $violations | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        throw "架构守卫失败: $RuleName"
    }
}

function Assert-NoImportAppctx {
    param([string]$Root)
    Assert-NoMatch -RuleName "禁止 import appctx" -Root $Root -Pattern '"myblogx/appctx"'
}

function Assert-NoServiceLocator {
    param([string]$Root)
    Assert-NoMatch -RuleName "禁止 Service Locator 模式" -Root $Root -Pattern 'MustFromGin|DepsFromGin|mustApp\('
}

function Assert-NoGlobalToken {
    param([string]$Root)
    Assert-NoMatch -RuleName "禁止 global.*" -Root $Root -Pattern '\bglobal\.'
}

function Assert-NoRuntimeSingletonCall {
    param([string]$Root)
    Assert-NoMatch -RuleName "禁止 runtime 配置包级单例调用" -Root $Root -Pattern 'site_service\.GetRuntime'
}

function Assert-ServiceNoGinImport {
    param([string]$Root)
    Assert-NoMatch -RuleName "service 禁止 import gin" -Root $Root -Pattern '"github\.com/gin-gonic/gin"'
}

function Assert-RepositoryNoServiceImport {
    param([string]$Root)
    Assert-NoMatch -RuleName "repository 禁止 import service" -Root $Root -Pattern '"myblogx/service/'
}

Assert-NoImportAppctx -Root (Join-Path $apiRoot "api")
Assert-NoImportAppctx -Root (Join-Path $apiRoot "service")
Assert-NoImportAppctx -Root (Join-Path $apiRoot "repository")
Assert-NoServiceLocator -Root (Join-Path $apiRoot "api")
Assert-NoServiceLocator -Root (Join-Path $apiRoot "service")
Assert-NoServiceLocator -Root (Join-Path $apiRoot "repository")
Assert-NoGlobalToken -Root $apiRoot
Assert-NoRuntimeSingletonCall -Root $apiRoot
Assert-ServiceNoGinImport -Root (Join-Path $apiRoot "service")
Assert-RepositoryNoServiceImport -Root (Join-Path $apiRoot "repository")

Write-Host "架构守卫检查通过。" -ForegroundColor Green
