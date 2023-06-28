import os
import yaml



def change_field_value(directory, field_to_change, new_value):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith(".yaml") or filename.endswith(".yml"):
                file_path = os.path.join(root, filename)
                
                with open(file_path, "r") as file:
                    try:
                        data = yaml.safe_load(file)
                        set_value_in_yaml(data, field_to_change, new_value)
                    except yaml.YAMLError as exc:
                        print(f"Error while processing {file_path}: {exc}")
                
                with open(file_path, "w") as file:
                    yaml.dump(data, file)
                    print(data)
                    print(f"Changed field '{field_to_change}' in {file_path}")

def set_value_in_yaml(data, position, value_to_set):
    current_obj = data
    positions = position.split('.')
    last_position = None  # Assigning a default value
    
    for pos in positions[:-1]:
        if '[' in pos:
            index_start = pos.index('[')
            index_end = pos.index(']')
            array_name = pos[:index_start]
            index = int(pos[index_start + 1:index_end])
            current_obj = current_obj[array_name][index]
        else:
            current_obj = current_obj[pos]
    
    last_position = positions[-1]
    if '[' in last_position:
        index_start = last_position.index('[')
        index_end = last_position.index(']')
        array_name = last_position[:index_start]
        index = int(last_position[index_start + 1:index_end])
        last_position = array_name
    else:
        index = None

    if last_position is not None and last_position in current_obj:
        if index is not None and index < len(current_obj[last_position]):
            current_obj[last_position][index] = value_to_set
        else:
            current_obj[last_position] = value_to_set


# Example usage
directory = "./examples/mobility"

change_field_value(directory, "value.context.bap_id", "{{bap_id}}")
change_field_value(directory, "value.context.bap_uri", "{{bap_uri}}")
change_field_value(directory, "value.context.bpp_id", "{{bpp_id}}")
change_field_value(directory, "value.context.bpp_uri", "{{bpp_uri}}")
change_field_value(directory, "value.context.transaction_id", "{{txn_id}}")
change_field_value(directory, "value.context.message_id", "{{msg_id}}")
change_field_value(directory, "value.context.timestamp", "{{timestamp}}")
