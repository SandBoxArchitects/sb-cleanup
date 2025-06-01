local QBCore = exports['qb-core']:GetCoreObject()
local isMenuOpen = false

function OpenCleanupMenu()
    if isMenuOpen then return end
    isMenuOpen = true

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "OPEN_MENU"
    })
end

function CloseCleanupMenu()
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = "CLOSE_MENU"
    })
    isMenuOpen = false
end

RegisterNetEvent('sb-cleanup:client:openMenu', function()
    OpenCleanupMenu()
end)

RegisterNUICallback('closeUI', function(_, cb)
    CloseCleanupMenu()
    cb({})
end)

RegisterNUICallback('executeAction', function(data, cb)
    TriggerServerEvent('sb-cleanup:server:execute', data)
    cb({})
end)