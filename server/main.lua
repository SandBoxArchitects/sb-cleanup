local QBCore = exports['qb-core']:GetCoreObject()

QBCore.Commands.Add('cleanup', 'Cleanup Menu (god)', {}, false, function(source)
    if QBCore.Functions.HasPermission(source, 'god') then
        TriggerClientEvent('sb-cleanup:client:openMenu', source)
    else
        QBCore.Functions.Notify(source, "You don't have permission for this", "error")
    end
end, 'god')

RegisterNetEvent('sb-cleanup:server:execute', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    
    if not Player or not QBCore.Functions.HasPermission(src, 'god') then
        TriggerClientEvent('QBCore:Notify', src, "Permission denied", "error")
        return
    end

    local count = 0
    local playerPed = GetPlayerPed(src)
    local playerCoords = GetEntityCoords(playerPed)
    local entities = {}

    if data.type == 'vehicle' then
        entities = GetAllVehicles()
    elseif data.type == 'ped' then
        entities = GetAllPeds()
    elseif data.type == 'prop' then
        entities = GetAllObjects()
    else
        TriggerClientEvent('QBCore:Notify', src, "Invalid entity type", "error")
        return
    end

    for _, entity in ipairs(entities) do
        print(entity)
        local shouldDelete = true
        
        if data.type == 'ped' and (entity == playerPed or IsPedAPlayer(entity)) then
            shouldDelete = false
        end
        
        if shouldDelete and data.distance then
            local entityCoords = GetEntityCoords(entity)
            if #(playerCoords - entityCoords) > data.distance then
                shouldDelete = false
            end
        end
        
        if shouldDelete and data.type == 'vehicle' and (data.emptyOnly or data.action == 'empty') then
            if GetPedInVehicleSeat(entity, -1) ~= 0 then
                shouldDelete = false
            end
        end
        
        if shouldDelete and DoesEntityExist(entity) then
            DeleteEntity(entity)
            count = count + 1
        end
    end


    local message = "Deleted "..count.." "..data.type
    if count ~= 1 then message = message.."s" end
    if data.action == 'empty' or data.emptyOnly then
        message = message.." (empty only)"
    end
    if data.distance then
        message = message.." within "..data.distance.."m"
    end
    
    TriggerClientEvent('QBCore:Notify', src, message, "success")
end)